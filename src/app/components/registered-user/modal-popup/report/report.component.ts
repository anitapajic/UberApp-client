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
  labels: Array<String> = [];
  public datas: Array<number> = [];
  filter : any;
  noRides: boolean = false;
  sum: any;  
  role : string | null | undefined;
  numOfRides : Map<String, Number> = new Map<String, Number>;
  numOfRidesValue : Array<Number> = new Array<Number>;
  numOfRidesDates : Array<String> = new Array<String>;
  totalKm = 0;


    datasets = [
      {label: "Number of rides",data: this.numOfRidesValue,
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

  printThisPage() {
      window.print();
  }
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
  ngOnInit() {
    this.authService.userState$.subscribe((result) => {
      this.role = result;
    });

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
    if(this.authService.getRole()=='PASSENGER'){
      this.authService.getRFilterNumOfRides(this.authService.getId()).subscribe({
        next: (result) => {
          this.numOfRides = result;
          console.log(this.numOfRides)
          this.numOfRidesDates = Array.from(Object.keys(this.numOfRides));
          this.numOfRidesValue = Array.from(Object.values(this.numOfRides));
          this.datasets = [
            { data: this.numOfRidesValue, 
              label: 'Number Of Rides',
              backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)",
                                "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", 
                                "rgba(54, 162, 235, 0.2)", "rgba(153, 102, 255, 0.2)", 
                                "rgba(201, 203, 207, 0.2)"],
              borderColor: ["rgb(255, 99, 132)", "rgb(255, 159, 64)", 
                            "rgb(255, 205, 86)", "rgb(75, 192, 192)", 
                            "rgb(54, 162, 235)", "rgb(153, 102, 255)", 
                            "rgb(201, 203, 207)"],
              borderWidth: 1, }];
          this.labels = this.numOfRidesDates;
        }
      });  
      this.authService.getKmOfPassengerRides(this.authService.getId()).subscribe({next:(result)=>{this.totalKm = result;}});
    }
    if(this.authService.getRole()=='DRIVER'){
      this.authService.getFilterNumOfDriverRides(this.authService.getId()).subscribe({
        next: (result) => {
          this.numOfRides = result;
          console.log(this.numOfRides)
          this.numOfRidesDates = Array.from(Object.keys(this.numOfRides));
          this.numOfRidesValue = Array.from(Object.values(this.numOfRides));
          this.datasets = [
            { data: this.numOfRidesValue, 
              label: 'Number Of Rides',
              backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)",
                                "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", 
                                "rgba(54, 162, 235, 0.2)", "rgba(153, 102, 255, 0.2)", 
                                "rgba(201, 203, 207, 0.2)"],
              borderColor: ["rgb(255, 99, 132)", "rgb(255, 159, 64)", 
                            "rgb(255, 205, 86)", "rgb(75, 192, 192)", 
                            "rgb(54, 162, 235)", "rgb(153, 102, 255)", 
                            "rgb(201, 203, 207)"],
              borderWidth: 1, }];
          this.labels = this.numOfRidesDates;
        }
      });
      this.authService.getKmOfDriverRides(this.authService.getId()).subscribe({next:(result)=>{this.totalKm = result;}});
    }
  }
}
