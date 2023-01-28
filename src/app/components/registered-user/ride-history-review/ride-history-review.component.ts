import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Ride } from 'src/app/model/Ride';
import { MapService } from '../../map/map.service'; 
import { LatLng,  marker, geoJSON, LayerGroup, icon } from 'leaflet';
import { LeafletDirective, LeafletModule } from '@asymmetrik/ngx-leaflet';


@Component({
  selector: 'app-ride-history-review',
  templateUrl: './ride-history-review.component.html',
  styleUrls: ['./ride-history-review.component.css']
})
export class RideHistoryReviewComponent{

  @ViewChild(LeafletDirective) leafletDirective: LeafletDirective | undefined;
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


  private map: any;
  role: string | null | undefined;
  result!: any;
  next : Boolean = false;
  public rideId: any;
  rideHistory: Array<Ride> = [];
  filter : any;
  noRides: boolean = false;

  
  constructor(private authService : AuthService, private route : ActivatedRoute, private router: Router){};
  
  getRideId(id?:number){
    this.rideId = id;
    console.log(this.rideId);
  }
  setRideId():number{

    return this.rideId;
  }
  bookAgain(){
    let changeDiv = document.getElementById("bookAgain") as HTMLElement;
    changeDiv.style.display="block"
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filter = params;
    });
    this.authService.getRideHistory(this.filter).subscribe({
      next: (result) => {
        this.rideHistory = result['results'];
        console.log(this.rideHistory);
        if(this.rideHistory.length === 0){
          this.noRides = true;
        }

      },
      error: (error) => {
        console.log(error);
      },
    });
    
  }

}
