import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FavoriteRouteCreate } from 'src/app/model/FavoriteRoute';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteRouteService {

  constructor(private http: HttpClient, private authService : AuthService) { }

  getFavoriteRoutes(): Observable<any>{
    return this.http.get('http://localhost:8085/api/ride/favorites/' + this.authService.getId())
  }
  
  createFavoriteRoute(newFavoriteRoute : FavoriteRouteCreate) : Observable<any>{
    return this.http.post('http://localhost:8085/api/ride/favorites', newFavoriteRoute);
  }

  deleteFavoriteRoute(id : number): Observable<any>{
    return this.http.delete('http://localhost:8085/api/ride/favorites/' + id);
  }
}
