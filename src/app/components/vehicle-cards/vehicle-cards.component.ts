import { Component } from '@angular/core';

@Component({
  selector: 'app-vehicle-cards',
  templateUrl: './vehicle-cards.component.html',
  styleUrls: ['./vehicle-cards.component.css']
})
export class VehicleCardsComponent {
  static scrollInto() {

    document.getElementById('vehicles')?.scrollIntoView();

  }

}
