import {Component, EventEmitter, Output} from '@angular/core';
import { Ride } from 'src/app/model/Ride';
import { AuthService } from '../../auth/auth.service';
import { MapService } from '../../map/map.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Panic} from "../../../model/Panic";
import {Reason} from "../../../model/Reason";

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
  rideStarted : boolean = false;
  ride! : Ride;
  time : string = "";
  isReadMore = true
  panicObject! : Panic;
  reason! : Reason;
  panics : Array<Panic> = new Array<Panic>();

  ngOnInit() {
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

  openForm(){
    let changeDiv = document.getElementById("changePassword") as HTMLElement;
    changeDiv.style.display="block"
  }

  panic(){
    this.hasRide = false;
    let oldPassword = document.getElementById("oldPass") as HTMLInputElement;
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
        this.time = time;
        console.log();
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
