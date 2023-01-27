import { HttpErrorResponse } from '@angular/common/http';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { LatLng,  marker, geoJSON, LayerGroup, icon } from 'leaflet';
import 'leaflet-routing-machine';
import { AuthService } from '../../auth/auth.service';
import { MapService } from '../map.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Ride, RideInfo } from 'src/app/model/Ride';
import { Vehicle } from 'src/app/model/Vehicle';
import { CurrentLocation } from 'src/app/model/CurrentLocation';
import { Driver, User } from 'src/app/model/User';
import { LeafletDirective, LeafletModule } from '@asymmetrik/ngx-leaflet';

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

  drivers : Array<Driver> = [];

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

  
  constructor(private mapService: MapService, private authService : AuthService) {}


  ngAfterViewInit(): void {
    this.initializeWebSocketConnection();

    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    

    this.initMap();
  }

  ngOnInit(): void {
    this.authService.userState$.subscribe((result) => {
      this.role = result;
    });


    this.mapService.getAllActiveRides().subscribe((ret) => {
      for (let ride of ret) {
        // let color = Math.floor(Math.random() * 16777215).toString(16);
        let geoLayerRouteGroup: LayerGroup = new LayerGroup();
        for (let step of (JSON.parse(JSON.parse(ride.routeJSON)))['routes'][0]['legs'][0]['steps']) {
          let routeLayer = geoJSON(step.geometry);
          routeLayer.setStyle({ color: `#D14054` });
          routeLayer.addTo(geoLayerRouteGroup);
          this.rides[ride.id] = geoLayerRouteGroup;
        }
        let markerLayer = marker([ride.vehicle.location.latitude, ride.vehicle.location.longitude], {
          icon: icon({
            iconUrl: '.\\assets\\images\\not-available-car.png',
            iconSize: [30, 30],
            iconAnchor: [18, 30],
          }),
        });
        markerLayer.addTo(geoLayerRouteGroup);
        this.vehicles[ride.vehicle.id] = markerLayer;
        this.mainGroup = [...this.mainGroup, geoLayerRouteGroup];
      }
    });


    // this.authService.getDrivers().subscribe({
    //   next: (result) => {
    //     this.drivers = result['results'];
    //     this.drivers.forEach(driver => {
    //       let costumIcom : L.Icon;
    //       if(driver.active){
    //         costumIcom = L.icon({
    //         iconUrl: '.\\assets\\images\\available-car.png',
    //         iconSize: [30, 30],
    //         iconAnchor: [18, 30],
    //         })
    //       }else{
    //         costumIcom = L.icon({
    //         iconUrl: '.\\assets\\images\\not-available-car.png',
    //         iconSize: [30, 30],
    //         iconAnchor: [18, 30],
    //         })}
          
    //       new L.Marker([driver.vehicle.location.latitude, driver.vehicle.location.longitude], 
    //         {icon: costumIcom}).addTo(this.map);
          
    //   });},
    //   error: (error) => {
    //     console.log(error);
    //   },
    // });
  }

  private initMap(): void {

    this.map = this.leafletDirective?.getMap();
    this.dep_input =  document.getElementById('fromLocation') as HTMLInputElement;
    this.des_input =  document.getElementById('toLocation') as HTMLInputElement;

    this.registerOnInput();
    this.registerOnClick();
  }


  async search(input: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.mapService.search(input).subscribe({
        next: (result) => {
          L.marker([result[0].lat, result[0].lon])
            .addTo(this.map)
            .bindPopup(result[0].display_name)
            .openPopup();
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

      //this.refreshMap();
      this.route(this.dep, this.des);

      if(this.role == null){
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
          vehicleType : vehicleType.value,
          babyTrasnport : babyTransport.checked,
          petTransport : petTransport.checked,
        }

        console.log(rideInfo);
        this.calculatePrice(rideInfo);
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

      console.log(
        'You clicked the map at latitude: ' + lat + ' and longitude: ' + lng
      );

      //alert(mp.getLatLng());
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

  private addMarker(): void {
    const lat: number = 45.25;
    const lon: number = 19.8228;

    L.marker([lat, lon])
      .addTo(this.map)
      .bindPopup('Trenutno se nalazite ovde.')
      .openPopup();
  }

  private refreshMap(): void{
    this.map.remove();
    this.initMap();
  }

  calculatePrice(rideInfo : RideInfo): void{
    let estimated = document.getElementById('estimated') as HTMLInputElement;

    let price = document.getElementById('price') as HTMLInputElement;
    let time = document.getElementById('time') as HTMLInputElement;

    console.log("Ride Info: ", JSON.stringify(rideInfo));

    this.mapService.calculateEstimatedPrice(JSON.stringify(rideInfo)).subscribe({
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
    this.stompClient.subscribe('/map-updates/update-vehicle-position', (message: { body: string }) => {
      console.log("new location")
      let vehicle: Vehicle = JSON.parse(message.body);
      let existingVehicle = this.vehicles[vehicle.id];
      console.log(existingVehicle);
      existingVehicle.setLatLng([vehicle.location.latitude, vehicle.location.longitude]);
      console.log(existingVehicle);

      // existingVehicle= marker([vehicle.location.latitude, vehicle.location.longitude], {
      //   icon: icon({
      //     iconUrl: '.\\assets\\images\\not-available-car.png',
      //     iconSize: [30, 30],
      //     iconAnchor: [18, 30],
      //   }),
      // });
      existingVehicle.update();
      

      
    });
  //   this.stompClient.subscribe('/map-updates/new-ride', (message: { body: string }) => {
  //     let ride: Ride = JSON.parse(message.body);
  //     let geoLayerRouteGroup: LayerGroup = new LayerGroup();
  //     let color = Math.floor(Math.random() * 16777215).toString(16);
  //     for (let step of JSON.parse(ride.routeJSON)['routes'][0]['legs'][0]['steps']) {
  //       let routeLayer = geoJSON(step.geometry);
  //       routeLayer.setStyle({ color: `#${color}` });
  //       routeLayer.addTo(geoLayerRouteGroup);
  //       this.rides[ride.id] = geoLayerRouteGroup;
  //     }
  //     let markerLayer = marker([ride.vehicle.longitude, ride.vehicle.latitude], {
  //       icon: icon({
  //         iconUrl: 'assets/car.png',
  //         iconSize: [35, 45],
  //         iconAnchor: [18, 45],
  //       }),
  //     });
  //     markerLayer.addTo(geoLayerRouteGroup);
  //     this.vehicles[ride.vehicle.id] = markerLayer;
  //     this.mainGroup = [...this.mainGroup, geoLayerRouteGroup];
  //   });
  //   this.stompClient.subscribe('/map-updates/ended-ride', (message: { body: string }) => {
  //     let ride: Ride = JSON.parse(message.body);
  //     this.mainGroup = this.mainGroup.filter((lg: LayerGroup) => lg !== this.rides[ride.id]);
  //     delete this.vehicles[ride.vehicle.id];
  //     delete this.rides[ride.id];
  //   });
  //   this.stompClient.subscribe('/map-updates/delete-all-rides', (message: { body: string }) => {
  //     this.vehicles = {};
  //     this.rides = {};
  //     this.mainGroup = [];
  //   });
  }

}