import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  isReadMore = true

  showText() {
     this.isReadMore = !this.isReadMore
  }
}
