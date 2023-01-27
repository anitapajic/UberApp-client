import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Ride } from 'src/app/model/Ride';

@Component({
  selector: 'app-ride-history-review',
  templateUrl: './ride-history-review.component.html',
  styleUrls: ['./ride-history-review.component.css']
})
export class RideHistoryReviewComponent {
  
  constructor(private authService : AuthService, private route : ActivatedRoute){};
  rideHistory: Array<Ride> = [];
  filter : any;
  noRides: boolean = false;
  sum: any;

  
  data = [
    { data: [21560, 45320, 35624, 45200, 55800, 50840, 48700], label: 'Income', backgroundColor:'#D14054' }
  ];
    labels = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Grey"];
    datasets = [
      {label: "Number of rides",data: [22, 33, 55, 12, 86, 23, 14],
      backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)",
        "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)",
        "rgba(153, 102, 255, 0.2)", "rgba(201, 203, 207, 0.2)"
      ],
      borderColor: ["rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)",
        "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(201, 203, 207)"
      ],
      borderWidth: 1
    }];

    horizontalBarOptions = {
      indexAxis: 'y',
    };

    getTotal(){
      var total = 0;
      for(let ride of this.rideHistory){
          total += ride.totalCost;
      }
      return total;
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
