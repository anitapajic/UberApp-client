import { Component } from '@angular/core';
import * as L from 'leaflet';
import { AuthService } from '../../auth/auth.service';
import localeFr from '@angular/common/locales/fr';

import { MapService } from '../../map/map.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ride-history-review',
  templateUrl: './ride-history-review.component.html',
  styleUrls: ['./ride-history-review.component.css']
})
export class RideHistoryReviewComponent {
  
  constructor(private authService : AuthService, private route : ActivatedRoute){};
  rideHistory: Array<any> = [];
  filter : any;
  noRides: boolean = false;


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filter = params;
    });

    this.authService.getRideHistory(this.filter).subscribe({
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

  }

}
