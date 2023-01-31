import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Ride } from 'src/app/model/Ride';
import { LatLng,  marker, geoJSON, LayerGroup, icon } from 'leaflet';
import { LeafletDirective, LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FavoriteRoute } from 'src/app/model/FavoriteRoute';
import { Review, ReviewDTO } from 'src/app/model/Review';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { MapService } from 'src/app/services/map/map.service';
import { StatisticsService } from 'src/app/services/statistics/statistics.service';

@Component({
  selector: 'app-ride-history-review',
  templateUrl: './ride-history-review.component.html',
  styleUrls: ['./ride-history-review.component.css']
})
export class RideHistoryReviewComponent implements OnInit{
  result!: any;
  filter : any;
  public rideId: any;
  noRides: boolean = false;
  private stompClient: any;
  rideHistory: Array<Ride> = [];
  

  role: string | null | undefined;
  currentRide! : Ride;
  rides: any = {};
  routingControl = L.Routing.control({ waypoints: [    ]});
  mainGroup: LayerGroup[] = [];
  sDate: any;
  eDate: any;
  // private map : any;
  constructor(private authService : AuthService,
              private routee : ActivatedRoute, 
              private statisticsService : StatisticsService){};

  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 14,
    center: L.latLng(45.253434, 19.831323),
  };
  ngOnInit() {
   this.initializeWebSocketConnection();
   this.routee.queryParams.subscribe(params => {
      this.filter = params;
    });
    this.authService.userState$.subscribe((result) => {
      this.role = result;
    });
    this.statisticsService.getRideHistory(this.filter).subscribe({
      next: (result) => {
        this.rideHistory = result['results'];
        if(this.rideHistory.length === 0){
          this.noRides = true;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.sDate = this.filter.startDate
    this.eDate = this.filter.endDate
  }
  postToController(): void{
    var starChecked = document.querySelector('input[name="rating"]:checked') as HTMLInputElement;
    console.log(starChecked.value)
    var star = document.getElementById('myratings') as HTMLElement;
    star.innerHTML = starChecked.value;
    let review: Review = {
      rating: parseInt(starChecked.value),
      rideId: this.currentRide.id,
      comment: '',
      driver: this.currentRide.driver.id
    }
    this.authService.postReview(review).subscribe({
      next: (result) => {
        console.log(result)
      },
      error: (error) => {
        console.log(error);
      },
    });

}
  openDetails(ride : Ride){
    this.currentRide = ride;
    this.addRoute(ride);
    let mapc = document.getElementById('map-container') as HTMLElement;
    mapc.style.display = 'block';
  }
  addRoute(ride : Ride){
    let geoLayerRouteGroup: LayerGroup = new LayerGroup();
    for (let step of JSON.parse(ride.routeJSON)['routes'][0]['legs'][0]['steps']) {
      console.log(step, "step");
      let routeLayer = geoJSON(step.geometry);
      routeLayer.setStyle({ color: `#D14054` });
      routeLayer.addTo(geoLayerRouteGroup);
      this.rides[ride.id] = geoLayerRouteGroup;
    }
    this.mainGroup = [geoLayerRouteGroup];
  }
  // innitMap(){
  //   this.map = L.map('map', {
  //     center: [45.2396, 19.8227],
  //     zoom: 13,
  //   });
  //   const tiles = L.tileLayer(
  //     'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  //     {
  //       maxZoom: 18,
  //       minZoom: 3,
  //       attribution:
  //         '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  //     }
  //   );
  //   tiles.addTo(this.map);
  // }
  bookAgain(){
    let changeDiv = document.getElementById("bookAgain") as HTMLElement;
    changeDiv.style.display="block"
  }
  // setRideId(id?:number){
  //   this.rideId = id;
  // }
  // getRideId():number{
  //   return this.rideId;
  // }
//   registerOnInput() {
//     let bookBtn = document.getElementById('detRideId');
//     bookBtn?.addEventListener('click', async (e : any) => {
//       const dep = await this.search("Mise Dimitrijevica 6");
//       this.dep = new LatLng(Number(dep[0].lat), Number(dep[0].lon));

//       const des = await this.search("Brace Ribnikar 17");
//       this.des = new LatLng(Number(des[0].lat), Number(des[0].lon));
//       this.route(this.dep, this.des);
//       console.log(this.dep,this.des)
      
//     });
// }
//   async search(input: string): Promise<any> {
//     return new Promise((resolve, reject) => {
//       this.mapService.search(input).subscribe({
//         next: (result) => {
//           resolve(result);
//         },
//         error: (error) => {
//           reject(error);
//         },
//       });
//     });
//   }
//   route(r1: any, r2: any): void {
//     if (this.routingControl != null)
//           this.removeRoutingControl();

//     this.routingControl = L.Routing.control({
//     waypoints: [
//       r1, r2
//     ]

//   }).addTo(this.map);
// }
//   removeRoutingControl(){
//     this.dep_marker.removeFrom(this.map);
//     this.des_marker.removeFrom(this.map);
//     this.routingControl.remove();   
//   }
  // ngAfterViewInit(): void {

  //   let DefaultIcon = L.icon({
  //     iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
  //   });

  //   L.Marker.prototype.options.icon = DefaultIcon;

  //   this.map = this.leafletDirective?.getMap();    
  // }
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
    this.stompClient.subscribe('/map-updates/review', (message: { body: string }) => {
      let review: ReviewDTO = JSON.parse(message.body);
      console.log(review);
      console.log(this.currentRide)
      if(this.currentRide.id == review.ride){
        let r : Review = {
          rating: review.rating,
          rideId: review.ride,
          comment: review.comment,
          driver: review.driver
        }
        this.currentRide.reviews.push(r);
      }
    });
  }
}
