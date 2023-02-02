import {Component, EventEmitter, Output} from '@angular/core';
import { Ride } from 'src/app/model/Ride';
import { AuthService } from '../../auth/auth.service';
import { MapService } from '../../map/map.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Reason} from "src/app/model/Reason";
import { min } from 'rxjs';
import { Panic } from 'src/app/model/Panic';
import { FavoriteRoute, FavoriteRouteCreate } from 'src/app/model/FavoriteRoute';
import { LatLng } from 'leaflet';

@Component({
  selector: 'app-follow-ride',
  templateUrl: './follow-ride.component.html',
  styleUrls: ['./follow-ride.component.css']
})
export class FollowRideComponent {
  constructor(private mapService : MapService, private authService : AuthService){}
  private stompClient: any;
  role: string | null | undefined;
  hasRequest : boolean = false;
  hasRide : boolean = false;
  waitingForDriver : boolean = false;
  rideStarted : boolean = false;
  ride! : Ride;
  time : string = "";
  rideDuration! : number;
  isReadMore = true
  panicObject! : Panic;
  reason! : Reason;
  panics : Array<Panic> = new Array<Panic>();
  favoriteRoutes : Array<FavoriteRoute> = [ ];

  dep!: LatLng;
  des!: LatLng;
  dep_input! : HTMLElement;
  des_input! : HTMLElement;

  ngOnInit() {
    this.createFavRoute()
    this.initializeWebSocketConnection();
    this.role = this.authService.getRole();
  }
  showText() {
    this.isReadMore = !this.isReadMore
 }

 decline(){
  this.mapService.declineRide(this.ride.id).subscribe({
    next: (result) => {
      console.log(result);
      this.hasRide = false;
      this.hasRequest = false;
    },
    error: (error) => {
      console.log(error);
    },
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
createFavRoute(){
  this.dep_input =  document.getElementById('favFromLocation') as HTMLElement;
  this.des_input =  document.getElementById('favToLocation') as HTMLElement;
  let favoriteName =  document.getElementById('favRouteName') as HTMLInputElement;

  let addBtn = document.getElementById('createBtn');
  addBtn?.addEventListener('click', async (e : any) => {
    const dep = await this.search(this.dep_input.innerText);
    console.log(dep);
    this.dep = new LatLng(Number(dep[0].lat), Number(dep[0].lon));

    const des = await this.search(this.des_input.innerText);
    console.log(des);
    this.des = new LatLng(Number(des[0].lat), Number(des[0].lon));

    let favoriteRoute : FavoriteRouteCreate = {
      locations: [{
        departure: {
          address: dep[0].display_name,
          latitude: dep[0].lat,
          longitude: dep[0].lon,
        },
        destination: {
          address: des[0].display_name,
          latitude: des[0].lat,
          longitude: des[0].lon,
        }
      }],
      babyTransport: false,
      petTransport: false,
      vehicleType: 'STANDARDNO',
      favoriteName: favoriteName.value,
      scheduledTime: null,
      passengers: [{id: this.authService.getId()}]
    };
    this.authService.createFavoriteRoute(favoriteRoute).subscribe({
      next: (result) => {
        console.log(result)
      },
      error: (error) => {
      console.log(error)
      },
    })
    let changeDiv = document.getElementById("favRouteRow") as HTMLElement;
    changeDiv.style.display="none"
    console.log("AAAAAAAAAAAAAAAAAAA")
    console.log(favoriteRoute);
});
};
  openForm(){
    let changeDiv = document.getElementById("panicReason") as HTMLElement;
    changeDiv.style.display="block"
    let remove = document.getElementById("panicBtn") as HTMLElement;
    remove.style.display="none"
  }
  openInputFav(){
    let changeDiv = document.getElementById("favRouteRow") as HTMLElement;
    changeDiv.style.display="block"
  }

  panic(){
    this.hasRide = false;
    let oldPassword = document.getElementById("reasonInput") as HTMLInputElement;
    console.log(oldPassword);
    this.reason = {
      reason : oldPassword.value
    }
    this.mapService.panicRide(this.ride.id, this.reason).subscribe({
      next: (result) => {
        this.panicObject = result;
        this.panics.push(this.panicObject);
        console.log(result);
        this.hasRide = false;

      },
      error: (error) => {
        console.log(error);
      },
    });

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

  openGlobalSocket(){

    this.stompClient.subscribe('/map-updates/ask-driver', (message: { body: string }) => {
      let ride: Ride = JSON.parse(message.body);
      if(this.authService.getId() == ride.passengers[0].id){
        this.ride = ride;
        this.hasRequest = true;
      }
    });

    this.stompClient.subscribe('/map-updates/inform', (message: { body: string }) => {
      let rideTime: any = JSON.parse(message.body);
      console.log(rideTime);
      let ride : Ride = rideTime.ride;
      console.log(ride);
      let time : string = rideTime.time;
      console.log(time, " time");
      if(this.authService.getId() == ride.passengers[0].id){
        this.waitingForDriver = true;
        this.time = time;
        console.log();
      }
    });

    this.stompClient.subscribe('/map-updates/change-time', (message: { body: string }) => {
      if(this.time != ""){
          let minutes : number = parseInt(this.time) -1;
          console.log(minutes, " : minutes");
          console.log(minutes >= 0, " : isGreater");

          if (minutes >= 0){
            this.time = minutes.toString();
          }
          else{
            this.time = "";
          }  
      }
      if(this.rideDuration >= 0){
        this.rideDuration += 2;
      }
    });

    this.stompClient.subscribe('/map-updates/new-ride', (message: { body: string }) => {
      let ride: Ride = JSON.parse(message.body);
      if(this.authService.getId() == ride.passengers[0].id){
        this.ride = ride;
        this.hasRequest = false;
        this.hasRide = true;
        this.time = '';
        this.rideStarted = true;
        this.rideDuration = 0;
      }
    });
    this.stompClient.subscribe('/map-updates/declined-ride', (message: { body: string }) => {
      let ride: Ride = JSON.parse(message.body);
      if(this.authService.getId() == ride.passengers[0].id){
        this.hasRequest = false;
        this.hasRide = false;
      }
    });

    this.stompClient.subscribe('/map-updates/end-ride', (message: { body: string }) => {
      let ride: Ride = JSON.parse(message.body);
      if(this.authService.getId() == ride.passengers[0].id){
        this.hasRide = false;
      }
    });


  }
}
