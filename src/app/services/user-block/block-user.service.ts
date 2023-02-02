import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Note } from 'src/app/model/Note';
import { User } from 'src/app/model/User';

@Injectable({
  providedIn: 'root'
})
export class BlockUserService {

  constructor(private http: HttpClient) { }

  
  getUsersWithNotes() : Observable<any>{
    return this.http.get('http://localhost:8085/api/user?size=1000');
  }

  blockUser(id : number): Observable<User>{
    return this.http.put<User>('http://localhost:8085/api/user/' + id + '/block', null);
  }

  unblockUser(id : number): Observable<User>{
    return this.http.put<User>('http://localhost:8085/api/user/' + id + '/unblock', null);
  }

  sendNote(note : Note): Observable<Note>{
    return this.http.post<Note>('http://localhost:8085/api/user/note', note);
  }

}
