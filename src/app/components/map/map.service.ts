import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentLocation } from 'src/app/model/CurrentLocation';
import { Path } from 'src/app/model/Path';
import { Rejection } from 'src/app/model/Rejection';
import { CreateRide, Ride, RideInfo } from 'src/app/model/Ride';
import {Reason} from "../../model/Reason";

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


  calculateEstimatedPrice(rideInfo: RideInfo): Observable<any> {
    return this.http.post(
      'http://localhost:8085/api/unregisteredUser', rideInfo, {
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



  async createRide(ride : CreateRide) : Promise<Observable<any>> {
    let routeJson : Promise<any> = this.getRouteJSON(ride.locations[0]);
    await routeJson.then(json => {
      ride.routeJSON = JSON.stringify(json);
    });
    return this.http.post<Ride>('http://localhost:8085/api/ride', ride);
  }

  getRouteJSON(location : Path) {
    return this.http.get('https://routing.openstreetmap.de/routed-car/route/v1/driving/' + location.departure.longitude + ',' + location.departure.latitude + ';' + location.destination.longitude + ',' + location.destination.latitude + '?geometries=geojson&overview=false&alternatives=true&steps=true', {headers : { 'routeJson' : 'true'}}).toPromise();
  }

  acceptRide(rideId : number): Observable<Ride> {
    return this.http.put<Ride>('http://localhost:8085/api/ride/' + rideId +'/accept', null);
  }

  declineRide(rideId : number): Observable<Ride> {
    return this.http.put<Ride>('http://localhost:8085/api/ride/' + rideId +'/withdraw', null);
  }

  startRide(rideId : number): Observable<Ride> {
    return this.http.put<Ride>('http://localhost:8085/api/ride/' + rideId +'/start', null);
  }

  endRide(rideId : number): Observable<Ride> {
    return this.http.put<Ride>('http://localhost:8085/api/ride/' + rideId +'/end', null);
  }

  cancelRide(rideId : number, rejection : Rejection): Observable<Ride> {
    return this.http.put<Ride>('http://localhost:8085/api/ride/' + rideId +'/cancel', rejection);
  }

  panicRide(rideId : number, reason : Reason): Observable<Ride>{
    return this.http.put<Ride>('http://localhost:8085//api/ride/' + rideId + '/panic', reason);
  }

}
