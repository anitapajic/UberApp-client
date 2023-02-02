import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentLocation } from 'src/app/model/CurrentLocation';
import { Path } from 'src/app/model/Path';
import { Rejection } from 'src/app/model/Rejection';
import { CreateRide, Ride, RideInfo } from 'src/app/model/Ride';
import {Reason} from "../../model/Reason";
import {Panic} from "../../model/Panic";

@Injectable({
  providedIn: 'root',
})
export class MapService {

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

}
