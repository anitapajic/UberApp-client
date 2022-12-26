import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { RouterModule } from '@angular/router';
import { CoordinatesComponent } from '../../coordinates/coordinates.component';

@NgModule({
  declarations: [MapComponent, CoordinatesComponent],
  imports: [CommonModule, RouterModule],
  exports: [MapComponent],

})
export class MapModule implements OnInit {

  constructor() {}

  ngOnInit(): void {}
}
