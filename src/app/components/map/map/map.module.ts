import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { RouterModule } from '@angular/router';
import { CoordinatesComponent } from '../coordinates/coordinates.component';
import { VehicleCardsComponent } from '../../unregistered-user/vehicle-cards/vehicle-cards.component';
import { AboutComponent } from '../../unregistered-user/about/about.component';
import { DownloadAppComponent } from '../../unregistered-user/download-app/download-app.component';
import { NavIconsComponent } from '../../registered-user/nav-icons/nav-icons.component';
import { RideHistoryComponent } from '../../registered-user/ride-history/ride-history.component';
import { FollowRideComponent } from '../../registered-user/follow-ride/follow-ride.component'; 
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FollowRideDriverComponent } from '../../registered-user/follow-ride-driver/follow-ride-driver.component';
import { ToastrModule } from 'ngx-toastr'

@NgModule({
  declarations: [MapComponent, CoordinatesComponent,VehicleCardsComponent, AboutComponent,DownloadAppComponent, NavIconsComponent,RideHistoryComponent,FollowRideComponent,FollowRideDriverComponent ],
  imports: [CommonModule, RouterModule, LeafletModule,
     ToastrModule.forRoot({
      timeOut : 2000,
      progressBar : true,
      progressAnimation : 'increasing',
      preventDuplicates : true
    }
  )],
  exports: [MapComponent],

})
export class MapModule implements OnInit {

  constructor() {}

  ngOnInit(): void {}
}
