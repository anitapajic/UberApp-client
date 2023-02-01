import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Note } from 'src/app/model/Note';

@Injectable({
  providedIn: 'root'
})
export class BlockUserService {

  constructor(private http: HttpClient) { }

  
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
