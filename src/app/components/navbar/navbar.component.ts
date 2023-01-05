import { Component } from '@angular/core';
import { VehicleCardsComponent } from '../vehicle-cards/vehicle-cards.component';
import { MapComponent } from '../map/map/map.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private router: Router) {}

  scrollMap(){
    this.router.navigate(['/home']);

    MapComponent.scrollInto();
  }

  
  async scrollVehicles() {
    await this.router.navigate(['/home']);

    VehicleCardsComponent.scrollInto();
  }

  
  async scrollApp() {
    await this.router.navigate(['/home']);

    //app.scrollInto();
  }

}
