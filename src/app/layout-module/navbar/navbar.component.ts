import { Component } from '@angular/core';
import { MapComponent } from '../../components/map/map/map.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/components/auth/auth.service';
import { VehicleCardsComponent } from 'src/app/components/unregistered-user/vehicle-cards/vehicle-cards.component';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  role: any;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.userState$.subscribe((result) => {
      this.role = result;
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: (result) => {
        alert(result);
        localStorage.removeItem('user');
        this.authService.setUser();
        this.router.navigate(['\home']);
      },
      error: (error) => {},
    });
  }

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
