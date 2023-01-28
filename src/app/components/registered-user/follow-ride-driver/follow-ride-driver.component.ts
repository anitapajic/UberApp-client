import { Component } from '@angular/core';
import { Ride } from 'src/app/model/Ride';
import { MapService } from '../../map/map.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from '../../auth/auth.service';

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
  hasRide : boolean = false;
  ride! : Ride;
  
  ngOnInit() {
    this.initializeWebSocketConnection();
    this.role = this.authService.getRole()
  }

  accept(){
    this.mapService.acceptRide(this.ride.id).subscribe({
      next: (result) => {
        console.log(result);
        this.accepted = true
      },
      error: (error) => {
        console.log(error);
      },
    });

  }
  
  decline(){
    this.mapService.declineRide(this.ride.id).subscribe({
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
      },
      error: (error) => {
        console.log(error);
      },
    });

  }
  end(){
      this.accepted = !this.accepted
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
  }
}
