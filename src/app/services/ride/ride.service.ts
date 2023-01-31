import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from 'src/app/model/Review';
import { Panic } from '../../model/Panic';
import { Path } from '../../model/Path';
import { Reason } from '../../model/Reason';
import { Rejection } from '../../model/Rejection';
import { CreateRide, Ride, RideInfo } from '../../model/Ride';

@Injectable({
  providedIn: 'root'
})
export class RideService {

  private headers = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    skip: 'true',
  });
  constructor(private http: HttpClient) {}


  calculateEstimatedPrice(rideInfo: RideInfo): Observable<any> {
    return this.http.post(
      'http://localhost:8085/api/unregisteredUser', rideInfo, {
        headers: this.headers,
    });
  }

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

  panicRide(rideId : number, reason : Reason): Observable<Panic>{
    return this.http.put<Panic>('http://localhost:8085/api/ride/' + rideId + '/panic', reason);
  }

  postReview(review: Review): Observable<any>{
    return this.http.post('http://localhost:8085/api/review/' + review.rideId, review);
  }

}
