import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DriverRegistration } from 'src/app/model/Registration';
import { Driver } from 'src/app/model/User';
import { CreateVehicle, Vehicle } from 'src/app/model/Vehicle';
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

  changeDriverActivity() : Observable<Driver>{
    return this.http.get<Driver>('http://localhost:8085/api/driver/'+ this.authService.getId() + '/activity');
  }

  getVehicles() : Observable<Vehicle[]>{
    return this.http.get<Vehicle[]>('http://localhost:8085/api/driver/vehicles');
  }

  createVehicle(newVehicle : CreateVehicle) : Observable<Vehicle>{
    return this.http.post<Vehicle>('http://localhost:8085/api/vehicle', newVehicle);
  }
}
