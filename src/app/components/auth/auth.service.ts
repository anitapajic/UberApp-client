import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Token } from '@angular/compiler';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Note } from 'src/app/model/Note';
import { CreateVehicle, Vehicle } from 'src/app/model/Vehicle';
import { User } from 'src/app/model/User';
import { Filter } from 'src/app/model/Filter';

import { ChangeUserInfo } from 'src/app/model/ChangeUserInfo';
import { ChangePassword, ResetPassword } from 'src/app/model/ChangePasswordDTO';
import { Login } from 'src/app/model/Login';
import { DriverRegistration, Registration } from 'src/app/model/Registration';

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

// Login and Registration
  
  login(login: Login): Observable<Token> {
    return this.http.post<Token>(
      'http://localhost:8085/api/user/login', login, {
        headers: this.headers,
    });
  }

  logout(): Observable<string> {
    return this.http.get('http://localhost:8085/api/user/logout', {
      responseType: 'text',
    });
  }

  registration(newPassenger: Registration): Observable<any> {
    return this.http.post(
      'http://localhost:8085/api/passenger', newPassenger
    );
  }

  driverRegistration(newDriver: DriverRegistration): Observable<any> {
    return this.http.post(
      'http://localhost:8085/api/driver', newDriver
    );
  }

  createVehicle(newVehicle : CreateVehicle) : Observable<any>{
    return this.http.post('http://localhost:8085/api/vehicle', newVehicle);
  }


// Profil info and changes

  getUser(): Observable<any>{
    return this.http.get('http://localhost:8085/api/user/' + this.userId)
  }

  changeProfileInfo(userInfo: ChangeUserInfo): Observable<any>{
    if(this.getRole() == 'PASSENGER'){
      return this.http.put('http://localhost:8085/api/passenger/' + this.userId, userInfo);

    }
    alert('Changes sent to admin');
    return this.http.post('http://localhost:8085/api/driver/update/' + this.userId, userInfo);
  }

  getChangeRequests() : Observable<any>{
    return this.http.get('http://localhost:8085/api/driver/update');
  }

  approveRequest(id : Int16Array): Observable<any>{
    return this.http.put('http://localhost:8085/api/driver/update/' + id + '/approve', null);
  }

  deleteRequest(id : Int16Array): Observable<any>{
    return this.http.delete('http://localhost:8085/api/driver/update/' + id + '/delete');
  }

 //Password changes

  sendCode(username : any): Observable<any> {
    return this.http.get('http://localhost:8085/api/user/' + this.userId + '/resetPassword', {
      headers: this.headers,
      params: username,
      responseType: 'text',
    }
    );
  }

  resetPassword(reset : ResetPassword): Observable<any> {
    return this.http.put('http://localhost:8085/api/user/' + this.userId + '/resetPassword', reset, {
      headers: this.headers,
      responseType: 'text',
    }
    );
  }

  changePassword(change : ChangePassword): Observable<any> {
    return this.http.put('http://localhost:8085/api/user/' + this.userId + '/changePassword', change
    );
  }

//Blocking users and leaving notes   

  getUsersWithNotes() : Observable<any>{
    return this.http.get('http://localhost:8085/api/user?size=1000');
  }

  blockUser(id : Int16Array): Observable<any>{
    return this.http.put('http://localhost:8085/api/user/' + id + '/block', null);
  }

  unblockUser(id : Int16Array): Observable<any>{
    return this.http.put('http://localhost:8085/api/user/' + id + '/unblock', null);
  }

  sendNote(note : Note): Observable<any>{
    return this.http.post('http://localhost:8085/api/user/note', note);
  }

//Ride History and Reports
  getRideHistory(filter : Filter):Observable<any>{
    let params = new HttpParams();
    if (filter.startDate) {
      params = params.append('startDate', filter.startDate);
    }
    if (filter.endDate) {
      params = params.append('endDate', filter.endDate);
    }    
    
    if(this.getRole() == 'PASSENGER'){
      return this.http.get('http://localhost:8085/api/passenger/' + this.userId + '/ride', {
        params : params
      });

    }
    if(this.getRole()== 'DRIVER'){
      return this.http.get('http://localhost:8085/api/driver/' + this.userId + '/ride', {
        params : params
      });
    }

    return this.http.post('http://localhost:8085/api/ride/all', filter);
  }

//Drivers and Vehicles
  getDrivers() : Observable<any>{
    return this.http.get('http://localhost:8085/api/driver', {
      headers: this.headers
    })
  }

  getVehicles() : Observable<any>{
    return this.http.get('http://localhost:8085/api/driver/vehicles');
  }

  getFavoriteRoutes(): Observable<any>{
    return this.http.get('http://localhost:8085/api/ride/favorites/' + this.userId)
  }


}
