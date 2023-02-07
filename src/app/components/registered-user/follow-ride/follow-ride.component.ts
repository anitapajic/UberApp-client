import {Component, EventEmitter, Output} from '@angular/core';
import { Ride } from 'src/app/model/Ride';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MapService } from 'src/app/services/map/map.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Reason} from "src/app/model/Reason";
import { min } from 'rxjs';
import { Panic } from 'src/app/model/Panic';
import { RideService } from 'src/app/services/ride/ride.service';
import { FavoriteRoute, FavoriteRouteCreate } from 'src/app/model/FavoriteRoute';
import { LatLng } from 'leaflet';
import { FavoriteRouteService } from 'src/app/services/favourite-route/favorite-route.service';
import { Review, ReviewDTO } from 'src/app/model/Review';

@Component({
  selector: 'app-follow-ride',
  templateUrl: './follow-ride.component.html',
  styleUrls: ['./follow-ride.component.css']
})
export class FollowRideComponent {
  constructor(private mapService : MapService,
              private rideService : RideService,
              private favService : FavoriteRouteService,
              private authService : AuthService){}
  private stompClient: any;
  role: string | null | undefined;
  hasRequest : boolean = false;
  hasRide : boolean = false;
  waitingForDriver : boolean = false;
  rideStarted : boolean = false;
  rateNow : boolean = false
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
    this.initializeWebSocketConnection();
    this.role = this.authService.getRole();
  }
  showText() {
    this.isReadMore = !this.isReadMore
 }

 decline(){
  this.rideService.declineRide(this.ride.id).subscribe({
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
  console.log(addBtn);
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
    this.favService.createFavoriteRoute(favoriteRoute).subscribe({
      next: (result) => {
        console.log(result)
      },
      error: (error) => {
      console.log(error)
      },
    })
    let changeDiv = document.getElementById("favRouteRow") as HTMLElement;
    changeDiv.style.display="none"
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
    this.createFavRoute();
  }

  panic(){
    this.hasRide = false;
    let oldPassword = document.getElementById("reasonInput") as HTMLInputElement;
    console.log(oldPassword);
    this.reason = {
      reason : oldPassword.value
    }
    this.rideService.panicRide(this.ride.id, this.reason).subscribe({
      next: (result) => {
        this.panicObject = result;
        this.panics.push(this.panicObject);
        console.log(result);
        this.hasRide = false;
        let changeDiv = document.getElementById("panicReason") as HTMLElement;
        changeDiv.style.display="none"
      },
      error: (error) => {
        console.log(error);
      },
    });

  }


  rateDriver(rate: boolean){
    let review: Review = {
      rating: null,
      rideId: this.ride.id,
      comment: '',
      driver: this.ride.driver.id
    }
    
    if(rate){
      var starChecked = document.querySelector('input[name="rating"]:checked') as HTMLInputElement;
      console.log(starChecked.value)
      var star = document.getElementById('myratings') as HTMLElement;
      star.innerHTML = starChecked.value;
      review.rating = parseFloat(starChecked.value);
    }
    
    
    this.rideService.postReview(review).subscribe({
      next: (result) => {
        console.log(result)
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
        this.rateNow = true;
        this.rideStarted = false;
      }
    });

    this.stompClient.subscribe('/map-updates/review', (message: { body: string }) => {
      let review: ReviewDTO = JSON.parse(message.body);
      this.rateNow = false;
    });
  
  }
}
