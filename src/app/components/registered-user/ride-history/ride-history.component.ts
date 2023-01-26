import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-ride-history',
  templateUrl: './ride-history.component.html',
  styleUrls: ['./ride-history.component.css']
})
export class RideHistoryComponent {
  drivers : any;
  role : any;
  constructor(private http: HttpClient, private authService : AuthService, private router : Router) { }
  static scrollInto() {
    document.getElementById('rideHistory')?.scrollIntoView();
  }
   @ViewChild('startInput') startDate: ElementRef | undefined;    
   @ViewChild('endInput') endDate: ElementRef | undefined;    


  filter(){
    var driver = document.getElementById("driver") as HTMLSelectElement;
    var keyword = document.getElementById("keyword") as HTMLInputElement;
    console.log(this.startDate)
    console.log(this.endDate)

    if(this.role == "ADMIN"){
      this.router.navigate(['/ride-history-review'], { queryParams: {
        startDate :this.startDate?.nativeElement.value,
        endDate : this.endDate?.nativeElement.value,
        driverId : driver.value,
        keyword : keyword.value
      }});
    }
    else{
      console.log(keyword.value, "aaaaaaaaa")
      console.log(this.startDate?.nativeElement.value, "start date")
      this.router.navigate(['/ride-history-review'], { queryParams: {
        startDate :this.startDate?.nativeElement.value,
        endDate : this.endDate?.nativeElement.value,
        } });

    }

  }

  ngOnInit() {
    this.authService.userState$.subscribe((result) => {
      this.role = result;
    });


    this.http.get('http://localhost:8085/api/driver')
      .subscribe(data => {
        this.drivers = data;
        this.drivers = this.drivers['results'];
      });
  }

}
