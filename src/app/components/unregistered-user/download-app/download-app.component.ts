import { Component } from '@angular/core';

@Component({
  selector: 'app-download-app',
  templateUrl: './download-app.component.html',
  styleUrls: ['./download-app.component.css']
})
export class DownloadAppComponent {
  
  static scrollInto() {

    document.getElementById('download-app')?.scrollIntoView();

  }
  
}
