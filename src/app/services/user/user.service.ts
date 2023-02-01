import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangePassword } from 'src/app/model/ChangePasswordDTO';
import { ChangeUserInfo } from 'src/app/model/ChangeUserInfo';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService : AuthService) { }

// Profil info and changes

  getUser(): Observable<any>{
    return this.http.get('http://localhost:8085/api/user/' + this.authService.getId())
  }

  changeProfileInfo(userInfo: ChangeUserInfo): Observable<any>{
    if(this.authService.getRole() == 'PASSENGER'){
      return this.http.put('http://localhost:8085/api/passenger/' + this.authService.getId(), userInfo);

    }
    alert('Changes sent to admin');
    return this.http.post('http://localhost:8085/api/driver/update/' + this.authService.getId(), userInfo);
  }

  changePassword(change : ChangePassword): Observable<any> {
    return this.http.put('http://localhost:8085/api/user/' + this.authService.getId() + '/changePassword', change
    );
  }

  getChangeRequests() : Observable<any>{
    return this.http.get('http://localhost:8085/api/driver/update');
  }

  approveRequest(id : number): Observable<any>{
    return this.http.put('http://localhost:8085/api/driver/update/' + id + '/approve', null);
  }

  deleteRequest(id : number): Observable<any>{
    return this.http.delete('http://localhost:8085/api/driver/update/' + id + '/delete');
  }


}
