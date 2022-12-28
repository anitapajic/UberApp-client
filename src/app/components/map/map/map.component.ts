import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { LatLng } from 'leaflet';
import 'leaflet-routing-machine';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  private map: any;
  result!: any;
  dep!: LatLng;
  dest!: LatLng;

  constructor(private mapService: MapService) {}

  private initMap(): void {
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

    this.registerOnInput();
    //this.addMarker();
    this.registerOnClick();
    //this.route();
  }



  async search(input: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.mapService.search(input).subscribe({
        next: (result) => {
          console.log(result);
          L.marker([result[0].lat, result[0].lon])
            .addTo(this.map)
            .bindPopup(result[0].display_name)
            .openPopup();
          resolve(result);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }


  registerOnInput() : void{
    var findBtn = document.getElementById('findBtn');
    findBtn?.addEventListener('click', async (e : any) => {
      var input =  document.getElementById('fromLocation') as HTMLInputElement;
      var street = input.value;
      const dep = await this.search(street);
      this.dep = new LatLng(Number(dep[0].lat), Number(dep[0].lon));

      var input =  document.getElementById('toLocation') as HTMLInputElement;
      var street = input.value;
      const des = await this.search(street);
      this.dest = new LatLng(Number(des[0].lat), Number(des[0].lon));
      this.route(this.dep, this.dest);

      
    })
  }



  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      this.mapService.reverseSearch(lat, lng).subscribe((res) => {
        console.log(res.display_name);
      });
      console.log(
        'You clicked the map at latitude: ' + lat + ' and longitude: ' + lng
      );
      const mp = new L.Marker([lat, lng]).addTo(this.map);
      alert(mp.getLatLng());
    });
  }



  route(r1: any, r2: any): void {
    L.Routing.control({
      waypoints: [
        r1, r2
      ]
    }).addTo(this.map);
  }

  private addMarker(): void {
    const lat: number = 45.25;
    const lon: number = 19.8228;

    L.marker([lat, lon])
      .addTo(this.map)
      .bindPopup('Trenutno se nalazite ovde.')
      .openPopup();
  }

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
  }
}