import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RideHistoryComponent } from 'src/app/components/registered-user/ride-history/ride-history.component';

@Component({
  selector: 'app-driver-navbar',
  templateUrl: './driver-navbar.component.html',
  styleUrls: ['./driver-navbar.component.css']
})
export class DriverNavbarComponent {
  constructor( private router: Router) {}

  async scrollRideHistory() {
    await this.router.navigate(['/home']);
    RideHistoryComponent.scrollInto();
  }
}
