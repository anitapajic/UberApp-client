import { HttpErrorResponse } from '@angular/common/http';
import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { LatLng } from 'leaflet';
import 'leaflet-routing-machine';
import { AuthService } from '../../auth/auth.service';
import { MapService } from '../map.service';
import { RideInfo } from '../model/rideInfo';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {

  vehicles : Array<any> = [];

  role: any;
  private map: any;
  result!: any;
  dep!: LatLng;
  des!: LatLng;

  des_marker : any = new L.Marker(new LatLng(0,0));
  dep_marker : any = new L.Marker(new LatLng(0,0));

  dep_input! : HTMLInputElement;
  des_input! : HTMLInputElement;
  next : Boolean = false;
  routingControl = L.Routing.control({ waypoints: [    ]});
  constructor(private mapService: MapService, private authService : AuthService) {}

  ngOnInit(): void {
    this.authService.userState$.subscribe((result) => {
      this.role = result;
    });

    this.authService.getVehicles().subscribe({
      next: (result) => {
        this.vehicles = result;
        console.log(this.vehicles);
        this.vehicles.forEach(vehicle => {
          if(vehicle.isDriverActive){
            var customIcon = L.icon({
            iconUrl: '.\\assets\\images\\available-car.png',
            iconSize: [30, 30],
            })
          }else{
            var customIcon = L.icon({
            iconUrl: '.\\assets\\images\\not-available-car.png',
            iconSize: [30, 30],
            })
          }
          
          new L.Marker([vehicle.currentLocation.latitude, vehicle.currentLocation.longitude], 
            {icon: customIcon}).addTo(this.map);
          
        });

      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private initMap(): void {
    this.dep_input =  document.getElementById('fromLocation') as HTMLInputElement;
    this.des_input =  document.getElementById('toLocation') as HTMLInputElement;

    this.map = L.map('map', {
      center: [45.2396, 19.8227],
      zoom: 13,
    });
    

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);

    this.registerOnInput();
    this.registerOnClick();
  }

  private refreshMap(): void{
    this.map.remove();
    this.initMap();
  }

  static scrollInto() {
    document.getElementById('map')?.scrollIntoView();
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
    var bookBtn = document.getElementById('bookBtn');
    bookBtn?.addEventListener('click', async (e : any) => {
      const dep = await this.search(this.dep_input.value);
      this.dep = new LatLng(Number(dep[0].lat), Number(dep[0].lon));

      const des = await this.search(this.des_input.value);
      this.des = new LatLng(Number(des[0].lat), Number(des[0].lon));

      //this.refreshMap();
      this.route(this.dep, this.des);

      if(this.role == null){
        var babyTransport = document.getElementById('babyTransport') as HTMLInputElement;
        var petTransport = document.getElementById('petTransport') as HTMLInputElement;
        var vehicleType = document.querySelector('input[name="car-type"]:checked') as HTMLInputElement;

        var rideInfo = {
          locations : [{
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

  calculatePrice(rideInfo : any): void{
    var estimated = document.getElementById('estimated') as HTMLInputElement;

    var price = document.getElementById('price') as HTMLInputElement;
    var time = document.getElementById('time') as HTMLInputElement;

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

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
  }
}