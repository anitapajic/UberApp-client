import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {User} from "../../../model/User";
import {Panic} from "../../../model/Panic";
import * as Stomp from 'stompjs';
import {FollowRideDriverComponent} from "../../registered-user/follow-ride-driver/follow-ride-driver.component";
import {DataService} from "../data.service";
import * as SockJS from "sockjs-client";

@Component({
  selector: 'app-panic',
  templateUrl: './panic.component.html',
  styleUrls: ['./panic.component.css']
})
export class PanicComponent implements OnInit {

  constructor(private authService: AuthService, private dataService: DataService) {
  };

  panics: Array<Panic> = [];
  noPanics: boolean = false;
  private stompClient: any;

  ngOnInit() {
    this.initializeWebSocketConnection();
    if (this.panics.length === 0) {
      this.noPanics = true;}
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
    this.stompClient.subscribe('/map-updates/panic', (message: { body: string }) => {
      let panic: Panic = JSON.parse(message.body);
      if (this.authService.getRole() == "ADMIN") {
        this.panics.push(panic);
        this.noPanics = false;
      }
    });

  }
}
