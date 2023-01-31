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
import { RideService } from 'src/app/services/ride/ride.service';

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
  constructor(private authService : AuthService,
              private rideService : RideService,
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
    this.rideService.postReview(review).subscribe({
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
  bookAgain(){
    let changeDiv = document.getElementById("bookAgain") as HTMLElement;
    changeDiv.style.display="block"
  }
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
