import { Component } from '@angular/core';
import { Ride } from 'src/app/model/Ride';
import { MapService } from '../../map/map.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from '../../auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Rejection } from 'src/app/model/Rejection';

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
        this.accepted = true
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
        this.accepted = false;
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
      this.accepted = !this.accepted
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
      if(this.role == 'DRIVER' && this.authService.getId() == ride.driver.id){
        this.ride = ride;
        this.hasRide = true;
      }
    });
    this.stompClient.subscribe('/map-updates/declined-ride', (message: { body: string }) => {
      let ride: Ride = JSON.parse(message.body);
      if(this.authService.getId() == ride.driver.id){
        this.hasRide = false;
      }
    });

    this.stompClient.subscribe('/map-updates/end-ride', (message: { body: string }) => {
      let ride: Ride = JSON.parse(message.body);
      if(this.role == 'DRIVER' && this.authService.getId() == ride.driver.id){
        this.hasRide = false;
      }
    });


  }
}
