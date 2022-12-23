import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MapComponent],
  imports: [CommonModule, RouterModule],
  exports: [MapComponent],

})
export class MapModule implements OnInit {

  constructor() {}

  ngOnInit(): void {}
}
