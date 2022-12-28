import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
 
  constructor(private dialogRef : MatDialog){}

  openDialog(){
    this.dialogRef.open(LoginComponent);
  }
}
