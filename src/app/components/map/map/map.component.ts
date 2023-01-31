import { HttpErrorResponse } from '@angular/common/http';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { LatLng,  marker, geoJSON, LayerGroup, icon } from 'leaflet';
import 'leaflet-routing-machine';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MapService } from 'src/app/services/map/map.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { CreateRide, Ride, RideInfo } from 'src/app/model/Ride';
import { Vehicle } from 'src/app/model/Vehicle';
import { CurrentLocation } from 'src/app/model/CurrentLocation';
import { Driver, User } from 'src/app/model/User';
import { LeafletDirective, LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ToastrService } from 'ngx-toastr'
import {Panic} from "../../../model/Panic";
import {Howl} from "howler";
import { MatSnackBar } from '@angular/material/snack-bar';
import { RideService } from 'src/app/services/ride/ride.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {

  @ViewChild(LeafletDirective) leafletDirective: LeafletDirective | undefined;
  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 14,
    center: L.latLng(45.253434, 19.831323),
  };
  vehicles: any = {};
  rides: any = {};
  mainGroup: LayerGroup[] = [];
  private stompClient: any;
  rideOffer!: Ride;
  hasRide : boolean = false;
  hasRequest : boolean = false;

  // drivers : Array<Driver> = [];

  private map: any;

  role: string | null | undefined;
  result!: any;

  //First click is dep, second is des, and so on
  next : Boolean = false;

  dep!: LatLng;
  des!: LatLng;
  des_marker : L.Marker = new L.Marker(new LatLng(0,0));
  dep_marker : L.Marker = new L.Marker(new LatLng(0,0));
  dep_input! : HTMLInputElement;
  des_input! : HTMLInputElement;

  routingControl = L.Routing.control({ waypoints: [    ]});


  constructor(private mapService: MapService,
              private authService : AuthService,
              private rideService : RideService) {}


  ngAfterViewInit(): void {
    this.initializeWebSocketConnection();

    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    this.map = this.leafletDirective?.getMap();

    if(this.role == "PASSENGER" || this.role == null){
      this.dep_input =  document.getElementById('fromLocation') as HTMLInputElement;
      this.des_input =  document.getElementById('toLocation') as HTMLInputElement;

      this.registerOnInput();
      this.registerOnClick();
    }
  }

  ngOnInit(): void {
    this.authService.userState$.subscribe((result) => {
      this.role = result;
    });


    //getActiveRide for passenger and driver if exist

    this.getAllDrivers();

    if(this.role == 'ADMIN'){
      this.adminMapView();
    }

  }

  refreshMap(){
      this.vehicles = {};
      this.rides = {};
      this.mainGroup = [];
  }

  getAllDrivers(){
    this.authService.getDrivers().subscribe((ret) => {
      for (let driver of ret['results']) {
        let geoLayerRouteGroup: LayerGroup = new LayerGroup();
        let markerLayer;
        let iconSize : L.PointExpression = [30,30];
        let iconUrl = '.\\assets\\images\\available-car.png'
        console.log(driver, "driver")
        if(!driver.active){
          iconUrl = '.\\assets\\images\\not-working-car.png'
        }
        if(driver.active && driver.hasRide){
          iconUrl = '.\\assets\\images\\not-available-car.png'
        }
        if(this.role == 'DRIVER' && driver.id == this.authService.getId()){
          iconSize = [40,40];
        }

        markerLayer = marker([driver.vehicle.location.latitude, driver.vehicle.location.longitude], {
          icon: icon({
            iconUrl: iconUrl,
            iconSize: iconSize,
            iconAnchor: [18, 30],
          }),
      });

        markerLayer.addTo(geoLayerRouteGroup);
        this.vehicles[driver.vehicle.id] = markerLayer;
        this.mainGroup = [...this.mainGroup, geoLayerRouteGroup];
      }
    });
  }

  adminMapView(){
    this.rideService.getAllActiveRides().subscribe((ret) => {
      for (let ride of ret) {
        // let color = Math.floor(Math.random() * 16777215).toString(16);
        let geoLayerRouteGroup: LayerGroup = new LayerGroup();
        for (let step of JSON.parse(ride.routeJSON)['routes'][0]['legs'][0]['steps']) {
          let routeLayer = geoJSON(step.geometry);
          routeLayer.setStyle({ color: `#D14054` });
          routeLayer.addTo(geoLayerRouteGroup);
          this.rides[ride.id] = geoLayerRouteGroup;
        }
        this.mainGroup = [...this.mainGroup, geoLayerRouteGroup];
      }
    });
  }

  async search(input: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.mapService.search(input).subscribe({
        next: (result) => {
          resolve(result);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  registerOnInput() : void{
    let bookBtn = document.getElementById('bookBtn');
    bookBtn?.addEventListener('click', async (e : any) => {
      const dep = await this.search(this.dep_input.value);
      this.dep = new LatLng(Number(dep[0].lat), Number(dep[0].lon));

      const des = await this.search(this.des_input.value);
      this.des = new LatLng(Number(des[0].lat), Number(des[0].lon));


      if(this.role == null){
        this.route(this.dep, this.des);
        let babyTransport = document.getElementById('babyTransport') as HTMLInputElement;
        let petTransport = document.getElementById('petTransport') as HTMLInputElement;
        let vehicleType = document.querySelector('input[name="car-type"]:checked') as HTMLInputElement;


        let rideInfo : RideInfo = {
          locations :  [{
            departure:{
              address : dep[0].display_name,
              latitude : dep[0].lat,
              longitude : dep[0].lon,
            },
            destination:{
              address : des[0].display_name,
              latitude : des[0].lat,
              longitude : des[0].lon,
            }
          }],
          babyTrasnport : babyTransport.checked,
          petTransport : petTransport.checked,
          vehicleType : vehicleType.value,
        };

        this.calculatePrice(rideInfo);
      }



      if(this.role == 'PASSENGER'){
        this.hasRequest = true;

        let babyTransport = document.getElementById('babyTransport') as HTMLInputElement;
        let petTransport = document.getElementById('petTransport') as HTMLInputElement;
        let vehicleType = document.querySelector('input[name="car-type"]:checked') as HTMLInputElement;

        let rideInfo : CreateRide = {
          locations :  [{
            departure:{
              address : dep[0].display_name,
              latitude : dep[0].lat,
              longitude : dep[0].lon,
            },
            destination:{
              address : des[0].display_name,
              latitude : des[0].lat,
              longitude : des[0].lon,
            }
          }],
          babyTrasnport : babyTransport.checked,
          petTransport : petTransport.checked,
          vehicleType : vehicleType.value,
          routeJSON : ""
        };
        (await this.rideService.createRide(rideInfo))
        .subscribe({
          next: (result) => {
            console.log(result);
          },
          error: (error) => {
            console.log("No available driver");
          },
        });
      }
    })

  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;

      this.mapService.reverseSearch(lat, lng).subscribe((res) => {
        if(!this.next) {
          this.des_marker.removeFrom(this.map);
          this.des_marker = new L.Marker([lat, lng]).addTo(this.map);

          this.dep = new LatLng(Number(lat), Number(lng));
          this.dep_input.value = res.display_name;
        }
        else{
          this.dep_marker.removeFrom(this.map);
          this.dep_marker = new L.Marker([lat, lng]).addTo(this.map);

          this.des = new LatLng(Number(lat), Number(lng));
          this.des_input.value = res.display_name;

        }
        this.next = !this.next;
      });
    });
  }

  route(r1: any, r2: any): void {
      if (this.routingControl != null)
            this.removeRoutingControl();

      this.routingControl = L.Routing.control({
      waypoints: [
        r1, r2
      ]

    }).addTo(this.map);
  }

  removeRoutingControl(){
    this.dep_marker.removeFrom(this.map);
    this.des_marker.removeFrom(this.map);
    this.routingControl.remove();
  }

  calculatePrice(rideInfo : RideInfo): void{
    let estimated = document.getElementById('estimated') as HTMLInputElement;

    let price = document.getElementById('price') as HTMLInputElement;
    let time = document.getElementById('time') as HTMLInputElement;

    console.log("Ride Info: ", JSON.stringify(rideInfo));

    this.rideService.calculateEstimatedPrice(rideInfo).subscribe({
      next: (result) => {
        console.log(JSON.stringify(result))
        estimated.style.display = "block";
        price.innerText = result['estimatedCost'];
        time.innerText = result['estimatedTimeInMinutes'];

      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          alert("Invalid input")
        }
      },
    })

  }


  static scrollInto() {
    document.getElementById('map')?.scrollIntoView();
  }

  // playSound(){
  //   const sound = new Howl({
  //     src: ['assets/panicNotification.wav']
  //   });
  //   sound.play();
  // }


  initializeWebSocketConnection() {
    let ws = new SockJS('http://localhost:8085/socket');
    this.stompClient = Stomp.over(ws);
    this.stompClient.debug = null;
    let that = this;
    this.stompClient.connect({}, function () {
      that.openGlobalSocket();
    });
  }

  openGlobalSocket() {
    //VEHICLE POSITION
    this.stompClient.subscribe('/map-updates/update-vehicle-position', (message: { body: string }) => {
      let vehicle: Vehicle = JSON.parse(message.body);
      let existingVehicle = this.vehicles[vehicle.id];
      existingVehicle.setLatLng([vehicle.location.latitude, vehicle.location.longitude]);
      existingVehicle.update();
    });
    //DRIVER ACTIVITY
    this.stompClient.subscribe('/map-updates/update-activity', (message: { body: string }) => {
      let driver : Driver = JSON.parse(message.body);

      let iconUrl = '.\\assets\\images\\available-car.png'
      if(!driver.active){
        iconUrl = '.\\assets\\images\\not-working-car.png'
      }
      if(driver.active && driver.hasRide){
        iconUrl = '.\\assets\\images\\not-available-car.png'
      }

      let iconSize : L.PointExpression = [30,30];
      if(this.role == 'DRIVER'){
        iconSize = [40,40];
      }
      let geoLayerRouteGroup: LayerGroup = new LayerGroup();

      let markerLayer = marker([driver.vehicle.location.latitude, driver.vehicle.location.longitude], {
        icon: icon({
          iconUrl: iconUrl,
          iconSize: iconSize,
          iconAnchor: [18, 30],
        }),
      });

      let oldMarker : L.Marker = this.vehicles[driver.vehicle.id];
      oldMarker.removeFrom(this.map);


      markerLayer.addTo(geoLayerRouteGroup);
      this.vehicles[driver.vehicle.id] = markerLayer;
      this.mainGroup = [...this.mainGroup, geoLayerRouteGroup];
    });


    //SENT REQUEST FOR RIDE
    this.stompClient.subscribe('/map-updates/ask-driver', (message: { body: string }) => {
      let ride: Ride = JSON.parse(message.body);
      if(this.authService.getId() == ride.passengers[0].id){
        this.hasRequest = true;
        console.log(ride);
      }
    });
    //DRIVER STARTED RIDE
    this.stompClient.subscribe('/map-updates/new-ride', (message: { body: string }) => {
      console.log('new ride');
      let ride: Ride = JSON.parse(message.body);
      if(this.role == 'ADMIN' || this.authService.getId() == ride.driver.id || this.authService.getId() == ride.passengers[0].id){

        this.hasRide = true;
        let geoLayerRouteGroup: LayerGroup = new LayerGroup();
        for (let step of JSON.parse(ride.routeJSON)['routes'][0]['legs'][0]['steps']) {
          let routeLayer = geoJSON(step.geometry);
          routeLayer.setStyle({ color:  `#D14054`});
          routeLayer.addTo(geoLayerRouteGroup);
          this.rides[ride.id] = geoLayerRouteGroup;
        }

        this.mainGroup = [...this.mainGroup, geoLayerRouteGroup];
      }

    });
    //DRIVER DECLINED OR PASSENGER CANCELED RIDE
    this.stompClient.subscribe('/map-updates/declined-ride', (message: { body: string }) => {
      let ride: Ride = JSON.parse(message.body);
      if(this.authService.getId() == ride.passengers[0].id){
        this.hasRide = false;
        this.hasRequest = false;
        //toastr ne radi, a alert pojavi 2 puta
        // this.toastr.success("There is no available driver at the moment", "NO DRIVER", {timeOut: 3000})

      }
    });

    //DRIVER ENDED RIDE
    this.stompClient.subscribe('/map-updates/end-ride', (message: { body: string }) => {
      let ride: Ride = JSON.parse(message.body);
      if(this.role == 'ADMIN' || this.authService.getId() == ride.driver.id || this.authService.getId() == ride.passengers[0].id){
        this.hasRide = false;
        this.hasRequest = false;
        this.mainGroup = this.mainGroup.filter((lg: LayerGroup) => lg !== this.rides[ride.id]);
        delete this.rides[ride.id];
      }
    });

    this.stompClient.subscribe('/map-updates/delete-all-rides', (message: { body: string }) => {
      this.rides = {};
      this.mainGroup = [];
      this.getAllDrivers();
    });


    // //PANIC PROCEDURE
    // this.stompClient.subscribe('/map-updates/panic', (message: { body: string }) => {
    //   let panic: Panic = JSON.parse(message.body);
    //   if(this.authService.getRole() == 'ADMIN'){
    //     this.playSound();
    //     this.snackBar.open("NEW PANIC NOTIFICATION FROM: " + panic.sender.name + " " + panic.sender.surname, 'Close');
    //   }
    // });

  }

}
