import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ride-history',
  templateUrl: './ride-history.component.html',
  styleUrls: ['./ride-history.component.css']
})
export class RideHistoryComponent {
  drivers : any;
  constructor(private http: HttpClient) { }
  
  static scrollInto() {
    document.getElementById('rideHistory')?.scrollIntoView();
  }


  ngOnInit() {
    this.http.get('http://localhost:8085/api/driver')
      .subscribe(data => {
        this.drivers = data;
        this.drivers = this.drivers['results'];
        console.log(this.drivers);
      });
  }

}
