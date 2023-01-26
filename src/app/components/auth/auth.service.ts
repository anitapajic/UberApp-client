import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Token } from '@angular/compiler';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private headers = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    skip: 'true',
  });


  userId = 0;
  user$ = new BehaviorSubject(null);
  userState$ = this.user$.asObservable();

  constructor(private http: HttpClient) { }

  login(auth: any): Observable<Token> {
    return this.http.post<Token>(
      'http://localhost:8085/api/user/login', auth, {
        headers: this.headers,
    });
  }
  logout(): Observable<string> {
    return this.http.get('http://localhost:8085/api/user/logout', {
      responseType: 'text',
    });
  }

  getRole(): any {
    if (this.isLoggedIn()) {
      var accessToken: any = localStorage.getItem('user');
      const helper = new JwtHelperService();
      this.userId = JSON.parse(accessToken)['id'];

      const role = helper.decodeToken(accessToken).role[0].authority;
      //alert(helper.decodeToken(accessToken).sub);
      return role;
    }
    return null;
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('user') != null) {
      return true;
    }
    return false;
  }

  setUser(): void {
    this.user$.next(this.getRole());
  }

  registration(auth: any): Observable<any> {
    return this.http.post(
      'http://localhost:8085/api/passenger', auth
    );
  }

  
  driverRegistration(auth: any): Observable<any> {
    return this.http.post(
      'http://localhost:8085/api/driver', auth
    );
  }

  sendCode(auth : any): Observable<any> {
    return this.http.get('http://localhost:8085/api/user/' + this.userId + '/resetPassword', {
      headers: this.headers,
      params: auth,
      responseType: 'text',
    }
    );
  }

  resetPassword(auth : any): Observable<any> {
    return this.http.put('http://localhost:8085/api/user/' + this.userId + '/resetPassword', auth, {
      headers: this.headers,
      responseType: 'text',
    }
    );
  }

  changePassword(auth : any): Observable<any> {
    return this.http.put('http://localhost:8085/api/user/' + this.userId + '/changePassword', auth
    );
  }

  getUser(): Observable<any>{
    return this.http.get('http://localhost:8085/api/user/' + this.userId)
  }

  changeProfileInfo(auth: any): Observable<any>{
    if(this.getRole() == "PASSENGER"){
      return this.http.put('http://localhost:8085/api/passenger/' + this.userId, auth);

    }
    alert("Changes sent to admin");
    return this.http.post('http://localhost:8085/api/driver/update/' + this.userId, auth);
  }

  getRideHistory(filter : any):Observable<any>{
    if(this.getRole() == "PASSENGER"){
      return this.http.get('http://localhost:8085/api/passenger/' + this.userId + "/ride", {
        params : filter
      });

    }
    if(this.getRole()== "DRIVER"){
      return this.http.get('http://localhost:8085/api/driver/' + this.userId + "/ride", {
        params : filter
      });
    }

    return this.http.post('http://localhost:8085/api/ride/all', filter);
  }

  getVehicles() : Observable<any>{
    return this.http.get('http://localhost:8085/api/driver/vehicles');
  }


  createVehicle(vehicle : any) : Observable<any>{
    return this.http.post('http://localhost:8085/api/vehicle', vehicle);
  }

  getDrivers() : Observable<any>{
    return this.http.get('http://localhost:8085/api/driver', {
      headers: this.headers
    })
  }

  
  getUsersWithNotes() : Observable<any>{
    return this.http.get('http://localhost:8085/api/user?size=1000');
  }

  getChangeRequests() : Observable<any>{
    return this.http.get('http://localhost:8085/api/driver/update');
  }

  approveRequest(id : Int16Array): Observable<any>{
    return this.http.put('http://localhost:8085/api/driver/update/' + id + "/approve", null);
  }

  deleteRequest(id : Int16Array): Observable<any>{
    return this.http.delete('http://localhost:8085/api/driver/update/' + id + "/delete");
  }

  blockUser(id : Int16Array): Observable<any>{
    return this.http.put('http://localhost:8085/api/user/' + id + "/block", null);
  }

  unblockUser(id : Int16Array): Observable<any>{
    return this.http.put('http://localhost:8085/api/user/' + id + "/unblock", null);
  }

  sendNote(note : any): Observable<any>{
    return this.http.post('http://localhost:8085/api/user/note', note);
  }
}
