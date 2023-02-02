import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RideHistoryComponent } from 'src/app/components/registered-user/ride-history/ride-history.component';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {
  constructor( private router: Router) {}

  async scrollRideHistory() {
    await this.router.navigate(['/home']);
    RideHistoryComponent.scrollInto();
  }
}
