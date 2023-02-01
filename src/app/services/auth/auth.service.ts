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
import {FilterRidesFromDate} from "../../model/FilterRidesFromDate";
import { FavoriteRouteCreate } from 'src/app/model/FavoriteRoute';
import { Review } from 'src/app/model/Review';

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
  
  getId(){
    return this.userId;
  }

  getRole(): any {
    if (this.isLoggedIn()) {
      var accessToken: any = localStorage.getItem('user');
      const helper = new JwtHelperService();
      
      this.userId = JSON.parse(accessToken)['id'];
      console.log('get role ',helper.decodeToken(accessToken).role[0] )
      const role = helper.decodeToken(accessToken).role[0].authority;
      return role;
    }
    return null;
  }

  setUser(): void {
    this.user$.next(this.getRole());
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('user') != null) {
      return true;
    }
    return false;
  }

// Login and Registration

  login(login: Login): Observable<Token> {
    return this.http.post<Token>(
      'http://localhost:8085/api/user/login', login, {
        headers: this.headers,
    });
  }

  logout(): Observable<string> {
    this.userId = 0;
    return this.http.get('http://localhost:8085/api/user/logout', {
      responseType: 'text',
    });
  }

  registration(newPassenger: Registration): Observable<any> {
    return this.http.post(
      'http://localhost:8085/api/passenger', newPassenger
    );
  }


 //Password reset

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



//Blocking users and leaving notes

  getUsersWithNotes() : Observable<any>{
    return this.http.get('http://localhost:8085/api/user?size=1000');
  }

  blockUser(id : number): Observable<any>{
    return this.http.put('http://localhost:8085/api/user/' + id + '/block', null);
  }

  unblockUser(id : number): Observable<any>{
    return this.http.put('http://localhost:8085/api/user/' + id + '/unblock', null);
  }

  sendNote(note : Note): Observable<any>{
    return this.http.post('http://localhost:8085/api/user/note', note);
  }

 
}
