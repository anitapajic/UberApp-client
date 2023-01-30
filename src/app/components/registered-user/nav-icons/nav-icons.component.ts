import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { LatLng } from 'leaflet';
import { FavoriteRoute, FavoriteRouteCreate } from 'src/app/model/FavoriteRoute';
import { AuthService } from '../../auth/auth.service';
import { MapService } from '../../map/map.service';
import { RideHistoryComponent } from '../ride-history/ride-history.component';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-nav-icons',
  templateUrl: './nav-icons.component.html',
  styleUrls: ['./nav-icons.component.css']
})
export class NavIconsComponent {
  star:any;
  favoriteRoutes : Array<FavoriteRoute> = [ ];

  private stompClient: any;
  role: string | null | undefined;
  dep!: LatLng;
  des!: LatLng;
  dep_input! : HTMLInputElement;
  des_input! : HTMLInputElement;
  constructor(private authService: AuthService, private router: Router,private mapService: MapService) {}

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
    this.getFavorites()
    this.createFavRoute()
    this.initializeWebSocketConnection()
  }
  getFavorites(){
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
  async search(input: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.mapService.search(input).subscribe({
        next: (result) => {
          resolve(result);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  } 
  createFavRoute(){

    this.dep_input =  document.getElementById('favFromLocation') as HTMLInputElement;
    this.des_input =  document.getElementById('favToLocation') as HTMLInputElement;
    let favoriteName =  document.getElementById('favRouteName') as HTMLInputElement;

    let addBtn = document.getElementById('createBtn');
    addBtn?.addEventListener('click', async (e : any) => {
      const dep = await this.search(this.dep_input.value);
      this.dep = new LatLng(Number(dep[0].lat), Number(dep[0].lon));

      const des = await this.search(this.des_input.value);
      this.des = new LatLng(Number(des[0].lat), Number(des[0].lon));

      let favoriteRoute : FavoriteRouteCreate = {
        locations: [{
          departure: {
            address: dep[0].display_name,
            latitude: dep[0].lat,
            longitude: dep[0].lon,
          },
          destination: {
            address: des[0].display_name,
            latitude: des[0].lat,
            longitude: des[0].lon,
          }
        }],
        babyTransport: false,
        petTransport: false,
        vehicleType: 'STANDARDNO',
        favoriteName: favoriteName.value,
        scheduledTime: null,
        passengers: [{id: this.authService.getId()}]
      };
      this.authService.createFavoriteRoute(favoriteRoute).subscribe({
        next: (result) => {
          console.log(result)
        },
        error: (error) => {
        console.log(error)
        },
      })
      console.log(favoriteRoute);
      this.getFavorites()
  });
  };

  initializeWebSocketConnection() {
    let ws = new SockJS('http://localhost:8085/socket');
    this.stompClient = Stomp.over(ws);
    this.stompClient.debug = null;
    let that = this;
    this.stompClient.connect({}, function () {
      that.openGlobalSocket();
    });
  }

  openGlobalSocket(){
    this.stompClient.subscribe('/map-updates/new-favorite-route', (message: { body: string }) => {
      let favRoute: FavoriteRoute = JSON.parse(message.body);
      if(this.authService.getId() == favRoute.passengers[0].id){
        this.favoriteRoutes.push(favRoute);
      }
    });
    


  }
}
