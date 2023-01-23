import { Component } from '@angular/core';
import * as L from 'leaflet';
import { AuthService } from '../../auth/auth.service';
import localeFr from '@angular/common/locales/fr';

import { MapService } from '../../map/map.service';

@Component({
  selector: 'app-ride-history-review',
  templateUrl: './ride-history-review.component.html',
  styleUrls: ['./ride-history-review.component.css']
})
export class RideHistoryReviewComponent {
  
  constructor(private authService : AuthService){};
  rideHistory: Array<any> = [];
  
  noRides: boolean = false;


  ngOnInit() {
   

    this.authService.getRideHistory().subscribe({
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
