import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RideHistoryComponent } from 'src/app/components/registered-user/ride-history/ride-history.component';
import { DriverService } from 'src/app/services/driver-vehicle/driver.service';

@Component({
  selector: 'app-driver-navbar',
  templateUrl: './driver-navbar.component.html',
  styleUrls: ['./driver-navbar.component.css']
})
export class DriverNavbarComponent {
  constructor( private router: Router, private driverService : DriverService) {}

  active : boolean = false;

  changeActivity(active : boolean){
    this.active = active;
    this.driverService.changeDriverActivity().subscribe({
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
