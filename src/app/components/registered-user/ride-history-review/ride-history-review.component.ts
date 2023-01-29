import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Ride } from 'src/app/model/Ride';
import { MapService } from '../../map/map.service'; 
import { LatLng,  marker, geoJSON, LayerGroup, icon } from 'leaflet';
import { LeafletDirective, LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FavoriteRoute } from 'src/app/model/FavoriteRoute';


@Component({
  selector: 'app-ride-history-review',
  templateUrl: './ride-history-review.component.html',
  styleUrls: ['./ride-history-review.component.css']
})
export class RideHistoryReviewComponent{
  result!: any;
  filter : any;
  private map: any;
  public rideId: any;
  next : Boolean = false;
  noRides: boolean = false;
  mainGroup: LayerGroup[] = [];
  rideHistory: Array<Ride> = [];
  role: string | null | undefined;

  dep!: LatLng;
  des!: LatLng;
  dep_input! : HTMLElement;
  des_input! : HTMLElement;
  des_marker : L.Marker = new L.Marker(new LatLng(0,0));
  dep_marker : L.Marker = new L.Marker(new LatLng(0,0));
  routingControl = L.Routing.control({ waypoints: [    ]});

  constructor(private authService : AuthService, private routee : ActivatedRoute, private router: Router,private mapService: MapService){};

  @ViewChild(LeafletDirective) leafletDirective: LeafletDirective | undefined;
  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 14,
    center: L.latLng(45.253434, 19.831323),
  };

  getRideId(id?:number){
    this.rideId = id;
  }
  setRideId():number{
    return this.rideId;
  }
  bookAgain(){
    let changeDiv = document.getElementById("bookAgain") as HTMLElement;
    changeDiv.style.display="block"
  }
  registerOnInput() {
    let bookBtn = document.getElementById('detRideId');
    bookBtn?.addEventListener('click', async (e : any) => {
      const dep = await this.search("Mise Dimitrijevica 6");
      this.dep = new LatLng(Number(dep[0].lat), Number(dep[0].lon));

      const des = await this.search("Brace Ribnikar 17");
      this.des = new LatLng(Number(des[0].lat), Number(des[0].lon));
      this.route(this.dep, this.des);
      console.log(this.dep,this.des)
      
    });
}
  async search(input: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.mapService.search(input).subscribe({
        next: (result) => {
          resolve(result);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }
  route(r1: any, r2: any): void {
    if (this.routingControl != null)
          this.removeRoutingControl();

    this.routingControl = L.Routing.control({
    waypoints: [
      r1, r2
    ]

  }).addTo(this.map);
}
  removeRoutingControl(){
    this.dep_marker.removeFrom(this.map);
    this.des_marker.removeFrom(this.map);
    this.routingControl.remove();   
  }
  ngOnInit() {
    this.routee.queryParams.subscribe(params => {
      this.filter = params;
    });
    this.authService.userState$.subscribe((result) => {
      this.role = result;
    });
    this.authService.getRideHistory(this.filter).subscribe({
      next: (result) => {
        this.rideHistory = result['results'];
        console.log(this.rideHistory);
        if(this.rideHistory.length === 0){
          this.noRides = true;
        }

      },
      error: (error) => {
        console.log(error);
      },
    });
    

    let geoLayerRouteGroup: LayerGroup = new LayerGroup();
    this.mainGroup = [...this.mainGroup, geoLayerRouteGroup];
 
  }
  ngAfterViewInit(): void {

    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    this.map = this.leafletDirective?.getMap();

   
    this.registerOnInput();
    
  }

}
