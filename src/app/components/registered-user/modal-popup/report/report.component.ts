import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/components/auth/auth.service';
import { Ride } from 'src/app/model/Ride';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {

   
  constructor(private authService : AuthService, private route : ActivatedRoute){};
  rideHistory: Array<Ride> = [];
  labels: Array<string> = [];
  public datas: Array<number> = [];
  filter : any;
  noRides: boolean = false;
  sum: any;  
  
  

  
  data = [
    { data: [21560, 45320, 35624, 45200, 55800, 50840, 48700], label: 'Income', backgroundColor:'#D14054' }
  ];
    //labels = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Grey"];
    datasets = [
      {label: "Number of rides",data: [22,33,44,55,11],
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
  getTotalTime(){
    var total = 0;
    for(let ride of this.rideHistory){
        total += ride.estimatedTimeInMinutes;
    }
    return total;
}
  getLabels(): Array<string>{
    let labels = new Array();
    for(let ride of this.rideHistory){
      labels.push(ride.startTime);
  }
  return labels;
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
