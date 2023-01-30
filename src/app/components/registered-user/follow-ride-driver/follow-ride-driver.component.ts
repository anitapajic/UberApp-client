import {Component, EventEmitter, Output} from '@angular/core';
import { Ride } from 'src/app/model/Ride';
import { MapService } from '../../map/map.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from '../../auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Rejection } from 'src/app/model/Rejection';
import {Panic} from "../../../model/Panic";
import {Reason} from "../../../model/Reason";
import {DataService} from "../../admin/data.service";

@Component({
  selector: 'app-follow-ride-driver',
  templateUrl: './follow-ride-driver.component.html',
  styleUrls: ['./follow-ride-driver.component.css']
})
export class FollowRideDriverComponent {

  constructor(private mapService : MapService, private authService : AuthService){}
  private stompClient: any;
  role: string | null | undefined;

  accepted : boolean = false;
  started : boolean = false;
  hasRide : boolean = false;
  ride! : Ride;
  rideDuration! : number;

  panicObject! : Panic;
  reason! : Reason;
  panics : Array<Panic> = new Array<Panic>();

  isReadMore = true

  rejection= new FormGroup({
    reason: new FormControl('', [Validators.required, Validators.minLength(20)]),
  });


  ngOnInit() {
    this.initializeWebSocketConnection();
    this.role = this.authService.getRole()
  }

  showText() {
     this.isReadMore = !this.isReadMore
  }

  accept(){
    this.mapService.acceptRide(this.ride.id).subscribe({
      next: (result) => {
        console.log(result);
        this.started = false;
      },
      error: (error) => {
        console.log(error);
      },
    });

  }

  getAddresss(address : string) : string{
    return "TEST TEST";
  }

  decline(){
    let rejection : Rejection = {
      reason : this.rejection.value.reason
    }

    this.mapService.cancelRide(this.ride.id, rejection).subscribe({
      next: (result) => {
        console.log(result);
        this.hasRide = false;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  start(){
    this.mapService.startRide(this.ride.id).subscribe({
      next: (result) => {
        console.log(result);
        this.started = true;
      },
      error: (error) => {
        console.log(error);
      },
    });

  }
  end(){
      this.hasRide = false;
      this.mapService.endRide(this.ride.id).subscribe({
        next: (result) => {
          console.log(result);
          this.hasRide = false;

        },
        error: (error) => {
          console.log(error);
        },
      });
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

  openForm(){
      let changeDiv = document.getElementById("changePassword") as HTMLElement;
      changeDiv.style.display="block"
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
    //WHEN RIDE IS CREATED ASK DRIVER IF HE CAN DO RIDE
    this.stompClient.subscribe('/map-updates/ask-driver', (message: { body: string }) => {
      let ride: Ride = JSON.parse(message.body);
      if(this.role == 'DRIVER' && this.authService.getId() == ride.driver.id){
        this.ride = ride;
        this.hasRide = true;
      }
    });
    //WHEN RIDE IS ACCEPTED
    this.stompClient.subscribe('/map-updates/inform', (message: { body: string }) => {
      let rideTime: any = JSON.parse(message.body);
      console.log("inform" , rideTime);
      let ride : Ride = rideTime.ride;
      console.log(ride);
      let time : string = rideTime.time;
      console.log(time);
      if(this.authService.getId() == ride.driver.id){
        this.accepted = true;
      }
    });

    //STARTED RIDE
    this.stompClient.subscribe('/map-updates/new-ride', (message: { body: string }) => {
      let ride: Ride = JSON.parse(message.body);
      if(this.authService.getId() == ride.driver.id){
        this.rideDuration = 0;
      }
    });


    //UPDATING RIDE DURATION
    this.stompClient.subscribe('/map-updates/change-time', (message: { body: string }) => {
      if(this.rideDuration >= 0){
        this.rideDuration += 2;
      }
    })
    //WHEN RIDE IS CANCELED OR REJECETED
    this.stompClient.subscribe('/map-updates/declined-ride', (message: { body: string }) => {
      let ride: Ride = JSON.parse(message.body);
      if(this.authService.getId() == ride.driver.id){
        this.hasRide = false;
        this.accepted = false;
      }
    });

    //WHEN RIDE IS ENDED
    this.stompClient.subscribe('/map-updates/end-ride', (message: { body: string }) => {
      let ride: Ride = JSON.parse(message.body);
      if(this.role == 'DRIVER' && this.authService.getId() == ride.driver.id){
        this.hasRide = false;
        this.accepted = false;
      }
    });



  }
}
