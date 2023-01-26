import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ride } from 'src/app/model/Ride';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  
  private headers = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    skip: 'true',
  });

  constructor(private http: HttpClient) {}

  search(street: string): Observable<any> {
    return this.http.get(
      'https://nominatim.openstreetmap.org/search?format=json&q=' + street
    );
  }

  reverseSearch(lat: number, lon: number): Observable<any> {
    return this.http.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&<params>`
    );
  }


  calculateEstimatedPrice(auth: any): Observable<any> {
    return this.http.post(
      'http://localhost:8085/api/unregisteredUser', auth, {
        headers: this.headers,
    });
  }

  //Ovo treba da je get all drivers
  // getVehicles() : Observable<any>{
  //   return this.http.get('http://localhost:8085/api/driver/vehicles');
  // }



  getAllActiveRides(): Observable<Ride[]> {
    return this.http.get<Ride[]>('http://localhost:8085/api/ride/active');
  }
}
