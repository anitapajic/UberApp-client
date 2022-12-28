import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  login(auth: any): Observable<any> {
    return this.http.post(
      'http://localhost:8085/api/user/login', auth
    );
  }
}
