import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { UrlSegment } from '@angular/router';
import { User } from 'src/app/model/User';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent {
  saveBtn : HTMLButtonElement | undefined;
  isShow = true;
  isHidden = false;
  user : User | undefined;
  constructor(private userService : UserService){};

  async formVisible(){
    this.isShow = !this.isShow;
    this.isHidden = !this.isHidden;
  }

  saveChanges(){

    //Napravi endpoint za izmene admina
    if(this.user?.authorities == 'ADMIN'){
      this.formVisible();
      return;
    }

    let nameSurname = document.getElementById("nameSurname") as HTMLInputElement;
    let username = document.getElementById("username") as HTMLInputElement;    
    let telephoneNumber = document.getElementById("telephoneNumber") as HTMLInputElement;
    let address = document.getElementById("address") as HTMLInputElement;


    let newInfo = {
      
      name : nameSurname.value.split(" ")[0],
      surname : nameSurname.value.split(" ")[1],
      username : username.value,
      telephoneNumber : telephoneNumber.value,
      address : address.value,
    }
    console.log(newInfo);

    this.userService.changeProfileInfo(newInfo).subscribe({
      next: (result) => {
        this.user = result;
        console.log(this.user);
        
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.formVisible();
  }


  loadFile = function (event: { target: { files: (Blob | MediaSource)[]; }; }) {
    let image = document.getElementById("output");
      URL.createObjectURL(event.target.files[0]);
  };

  editPassword(){
    let changeDiv = document.getElementById("changePassword") as HTMLElement;
    changeDiv.style.display="block"

  }

  changePassword(){
    let oldPassword = document.getElementById("oldPass") as HTMLInputElement;    
    let newPassword = document.getElementById("newPass") as HTMLInputElement;
    let confirmPassword = document.getElementById("confirmNewPass") as HTMLInputElement;

    let change = {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    }
    if(newPassword.value != confirmPassword.value){
      alert("Passwords not matching")
      return;
    }

    this.userService.changePassword(change).subscribe({
      next: (result) => {
        alert("Password successfully changed")
      },
      error: (error) => {

        alert(error.error.message);
      },
    });




    let changeDiv = document.getElementById("changePassword") as HTMLElement;
    changeDiv.style.display="none"


  }
  
  
  editPicture(){
    let changeDiv = document.getElementById("changePicture") as HTMLElement;
    changeDiv.style.display="block"
  }

  
  changePicture(){
    let changeDiv = document.getElementById("changePicture") as HTMLElement;
    changeDiv.style.display="none"
  }

  ngOnInit() {

    this.userService.getUser().subscribe({
      next: (result) => {
        this.user = result;
      },
      error: (error) => {
 
        console.log(error);
      },
    });

  }

  }


