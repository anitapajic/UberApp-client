import { Component } from '@angular/core';
import { Ride } from 'src/app/model/Ride';
import { AuthService } from '../../auth/auth.service';
import { MapService } from '../../map/map.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-follow-ride',
  templateUrl: './follow-ride.component.html',
  styleUrls: ['./follow-ride.component.css']
})
export class FollowRideComponent {
  constructor(private mapService : MapService, private authService : AuthService){}
  private stompClient: any;
  role: string | null | undefined;

  hasRide : boolean = false;
  ride! : Ride;
  isReadMore = true

  ngOnInit() {
    this.initializeWebSocketConnection();
    this.role = this.authService.getRole()
  }
  showText() {
    this.isReadMore = !this.isReadMore
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
    this.stompClient.subscribe('/map-updates/new-ride', (message: { body: string }) => {
      let ride: Ride = JSON.parse(message.body);
      if(this.role == 'PASSENGER' && this.authService.getId() == ride.passengers[0].id){
        this.ride = ride;
        this.hasRide = true;
      }
    });
    this.stompClient.subscribe('/map-updates/end-ride', (message: { body: string }) => {
      let ride: Ride = JSON.parse(message.body);
      if(this.role == 'PASSENGER' && this.authService.getId() == ride.passengers[0].id){
        this.hasRide = false;
      }
    });


  }
}
