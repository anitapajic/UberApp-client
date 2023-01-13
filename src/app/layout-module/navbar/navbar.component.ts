import { Component } from '@angular/core';
import { VehicleCardsComponent } from '../../components/vehicle-cards/vehicle-cards.component';
import { MapComponent } from '../../components/map/map/map.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/components/auth/auth.service';
import { DownloadAppComponent } from 'src/app/components/download-app/download-app.component';
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

  async scrollMap(){
    await this.router.navigate(['/home']);
    MapComponent.scrollInto();
  }

  
  async scrollVehicles() {
    await this.router.navigate(['/home']);
    VehicleCardsComponent.scrollInto();
  }

  
  async scrollApp() {
    await this.router.navigate(['/home']);
    DownloadAppComponent.scrollInto();
  }

}
