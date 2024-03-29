import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RideHistoryComponent } from 'src/app/components/registered-user/ride-history/ride-history.component';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.css']
})
export class UserNavbarComponent {

  constructor( private router: Router) {}

  async scrollRideHistory() {
    await this.router.navigate(['/home']);
    RideHistoryComponent.scrollInto();
  }

}
