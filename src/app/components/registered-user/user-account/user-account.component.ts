import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent {

  isShow = true;
  isHidden = false;
  user : any;
  constructor(private authService : AuthService){};

  async formVisible(){
    this.isShow = !this.isShow;
    this.isHidden = !this.isHidden;
  }


  loadFile = function (event: { target: { files: (Blob | MediaSource)[]; }; }) {
    var image = document.getElementById("output");
      URL.createObjectURL(event.target.files[0]);
  };

  ngOnInit() {
    this.authService.getUser().subscribe({
      next: (result) => {
        this.user = result;
        console.log(this.user);

      },
      error: (error) => {
        console.log(error);
      },
    });

  }

}
