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


    if(this.role == "ADMIN"){
      console.log(keyword.value, "aaaaaaaaa")
      this.router.navigate(['/ride-history-review'], { queryParams: {
        startDate :this.startDate?.nativeElement.value,
        endDate : this.endDate?.nativeElement.value,
        driverId : driver.value,
        keyword : keyword.value
      }});
    }
    else{
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
