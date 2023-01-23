import { Component } from '@angular/core';
import * as L from 'leaflet';
import { AuthService } from '../../auth/auth.service';
import { MapService } from '../../map/map.service';

@Component({
  selector: 'app-ride-history-review',
  templateUrl: './ride-history-review.component.html',
  styleUrls: ['./ride-history-review.component.css']
})
export class RideHistoryReviewComponent {
  role: any;
  private map: any;
  result!: any;

  dep_input! : HTMLInputElement;
  des_input! : HTMLInputElement;
  next : Boolean = false;
  
  routingControl = L.Routing.control({ waypoints: [    ]});
  constructor(private mapService: MapService, private authService : AuthService) {}

  private initMap(): void {
    this.dep_input =  document.getElementById('fromLocation') as HTMLInputElement;
    this.des_input =  document.getElementById('toLocation') as HTMLInputElement;

    this.map = L.map('map', {
      center: [45.2396, 19.8227],
      zoom: 13,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
  }
  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
  }

}
