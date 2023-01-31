import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DriverRegistration } from 'src/app/model/Registration';
import { CreateVehicle } from 'src/app/model/Vehicle';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private headers = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    skip: 'true',
  });

  constructor(private http: HttpClient, private authService : AuthService) { }

  getDrivers() : Observable<any>{
    return this.http.get('http://localhost:8085/api/driver', {
      headers: this.headers
    })
  }

  driverRegistration(newDriver: DriverRegistration): Observable<any> {
    return this.http.post(
      'http://localhost:8085/api/driver', newDriver
    );
  }

  changeDriverActivity() : Observable<any>{
    return this.http.get('http://localhost:8085/api/driver/'+ this.authService.getId() + '/activity');
  }

  getVehicles() : Observable<any>{
    return this.http.get('http://localhost:8085/api/driver/vehicles');
  }

  createVehicle(newVehicle : CreateVehicle) : Observable<any>{
    return this.http.post('http://localhost:8085/api/vehicle', newVehicle);
  }
}
