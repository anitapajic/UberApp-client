import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Ride } from 'src/app/model/Ride';
import { MapService } from '../../map/map.service'; 

@Component({
  selector: 'app-ride-history-review',
  templateUrl: './ride-history-review.component.html',
  styleUrls: ['./ride-history-review.component.css']
})
export class RideHistoryReviewComponent{
  private map: any;
  role: string | null | undefined;
  result!: any;
  next : Boolean = false;

  rideHistory: Array<Ride> = [];
  filter : any;
  noRides: boolean = false;

  
  constructor(private authService : AuthService, private route : ActivatedRoute){};
  

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
