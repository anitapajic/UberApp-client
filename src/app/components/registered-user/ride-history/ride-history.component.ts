import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';
import { User } from 'src/app/model/User';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-ride-history',
  templateUrl: './ride-history.component.html',
  styleUrls: ['./ride-history.component.css']
})
export class RideHistoryComponent {
  drivers : Array<User> = [];

  role : string | null | undefined;
  constructor(private http: HttpClient, private authService : AuthService, private router : Router) { }
  static scrollInto() {
    document.getElementById('rideHistory')?.scrollIntoView();
  }
   @ViewChild('startInput') startDate: ElementRef | undefined;    
   @ViewChild('endInput') endDate: ElementRef | undefined;    


  filter(){
    let driver = document.getElementById("driver") as HTMLSelectElement;
    let keyword = document.getElementById("keyword") as HTMLInputElement;


    if(this.role == "ADMIN"){
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


    this.authService.getDrivers().subscribe({
      next : (result) => {
        this.drivers = result['results'];
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

}
