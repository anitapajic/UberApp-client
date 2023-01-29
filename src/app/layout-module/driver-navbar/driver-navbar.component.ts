import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/components/auth/auth.service';
import { RideHistoryComponent } from 'src/app/components/registered-user/ride-history/ride-history.component';

@Component({
  selector: 'app-driver-navbar',
  templateUrl: './driver-navbar.component.html',
  styleUrls: ['./driver-navbar.component.css']
})
export class DriverNavbarComponent {
  constructor( private router: Router, private authService : AuthService) {}

  active : boolean = false;

  changeActivity(active : boolean){
    this.active = active;
    this.authService.changeDriverActivity().subscribe({
      next : (result) => {
        console.log(result);
      },error : (er) =>{
        console.log(er);
      }
    });
  }

  async scrollRideHistory() {
    await this.router.navigate(['/home']);
    RideHistoryComponent.scrollInto();
  }
}
