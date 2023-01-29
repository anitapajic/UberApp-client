import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { FavoriteRoute } from 'src/app/model/FavoriteRoute';
import { AuthService } from '../../auth/auth.service';
import { RideHistoryComponent } from '../ride-history/ride-history.component';

@Component({
  selector: 'app-nav-icons',
  templateUrl: './nav-icons.component.html',
  styleUrls: ['./nav-icons.component.css']
})
export class NavIconsComponent {
  star:any;
  favoriteRoutes : Array<FavoriteRoute> = [ ];
  constructor(private authService: AuthService, private router: Router) {}

  async scrollRideHistory() {
    await this.router.navigate(['/home']);

    RideHistoryComponent.scrollInto();
  }
  addNewRoute(){
    let changeDiv = document.getElementById("addNewBtn") as HTMLElement;
    changeDiv.style.display="block"
  }

  postToController(): void{
    var starChecked = document.querySelector('input[name="rating"]:checked') as HTMLInputElement;
    console.log(starChecked.value)
    var star = document.getElementById('myratings') as HTMLElement;
    star.innerHTML = starChecked.value;

}
  ngOnInit(){
    this.authService.getFavoriteRoutes().subscribe({
      next: (result) => {
        this.favoriteRoutes = result;
        console.log(this.favoriteRoutes);

      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
