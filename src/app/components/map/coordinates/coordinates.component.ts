import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Ride } from 'src/app/model/Ride';
import { ReviewDTO } from 'src/app/model/Review';

@Component({
  selector: 'app-coordinates',
  templateUrl: './coordinates.component.html',
  styleUrls: ['./coordinates.component.css']
})
export class CoordinatesComponent {
  role: String | null | undefined;
  private stompClient: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.userState$.subscribe((result) => {
      this.role = result;
    });
  }

  change(){
    if(this.role == 'PASSENGER'){
      let form = document.getElementById('main-form') as HTMLElement;
      form.style.opacity = '0%';

    }
  }


}
