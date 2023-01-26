import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { UrlSegment } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent {
  saveBtn : HTMLButtonElement | undefined;
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

  editPassword(){
    var changeDiv = document.getElementById("changePassword") as HTMLElement;
      changeDiv.style.display="block"
    
  }

  changePassword(){
    var oldPassword = document.getElementById("oldPass") as HTMLInputElement;    
    var newPassword = document.getElementById("newPass") as HTMLInputElement;

    var auth = {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    }

    this.authService.changePassword(auth).subscribe({
      next: (result) => {
        alert("Password successfully changed")
      },
      error: (error) => {

        alert(error.error.message);
      },
    });




    var changeDiv = document.getElementById("changePassword") as HTMLElement;
    changeDiv.style.display="none"


  }
  
  
  editPicture(){
    var changeDiv = document.getElementById("changePicture") as HTMLElement;
    changeDiv.style.display="block"
  }

  
  changePicture(){
    var changeDiv = document.getElementById("changePicture") as HTMLElement;
    changeDiv.style.display="none"
  }

  ngOnInit() {

    this.authService.getUser().subscribe({
      next: (result) => {
        this.user = result;

      },
      error: (error) => {
 
        console.log(error);
      },
    });

   this.saveBtn = document.getElementById("saveBtn") as HTMLButtonElement;
   this.saveBtn.addEventListener("click", () =>{
    var nameSurname = document.getElementById("nameSurname") as HTMLInputElement;
    var username = document.getElementById("username") as HTMLInputElement;    
    var telephoneNumber = document.getElementById("telephoneNumber") as HTMLInputElement;
    var address = document.getElementById("address") as HTMLInputElement;

    var auth = {
       
        name : nameSurname.value.split(" ")[0],
        surname : nameSurname.value.split(" ")[1],
        username : username.value,
        telephoneNumber : telephoneNumber.value,
        address : address.value,
      }

      this.authService.changeProfileInfo(auth).subscribe({
        next: (result) => {
          this.user = result;
          console.log(this.user);
          
        },
        error: (error) => {
          console.log(error);
        },
      });
  })

  }

  }


