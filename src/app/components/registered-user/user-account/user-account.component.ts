import { Component } from '@angular/core';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent {

  isShow = true;
  isHidden = false;

  async formVisible(){
    this.isShow = !this.isShow;
    this.isHidden = !this.isHidden;
  }


  loadFile = function (event: { target: { files: (Blob | MediaSource)[]; }; }) {
    var image = document.getElementById("output");
      URL.createObjectURL(event.target.files[0]);
  };
}
