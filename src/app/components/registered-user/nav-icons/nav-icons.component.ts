import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { RideHistoryComponent } from '../ride-history/ride-history.component';

@Component({
  selector: 'app-nav-icons',
  templateUrl: './nav-icons.component.html',
  styleUrls: ['./nav-icons.component.css']
})
export class NavIconsComponent {

  constructor(private authService: AuthService, private router: Router) {}

  async scrollRideHistory() {
    await this.router.navigate(['/home']);

    RideHistoryComponent.scrollInto();
  }
}
