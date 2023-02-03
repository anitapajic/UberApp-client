import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FavoriteRoute, FavoriteRouteCreate } from 'src/app/model/FavoriteRoute';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteRouteService {

  constructor(private http: HttpClient, private authService : AuthService) { }

  getFavoriteRoutes(): Observable<FavoriteRoute[]>{
    return this.http.get<FavoriteRoute[]>('http://localhost:8085/api/ride/favorites/' + this.authService.getId())
  }
  
  createFavoriteRoute(newFavoriteRoute : FavoriteRouteCreate) : Observable<FavoriteRoute>{
    return this.http.post<FavoriteRoute>('http://localhost:8085/api/ride/favorites', newFavoriteRoute);
  }

  deleteFavoriteRoute(id : number): Observable<string>{
    return this.http.delete<string>('http://localhost:8085/api/ride/favorites/' + id);
  }
}
