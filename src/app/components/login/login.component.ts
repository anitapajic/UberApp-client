import {Component, OnInit} from '@angular/core';
import { FormControl,FormGroup,Validators,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor( private formBuilder: FormBuilder){}
  
  onSubmit() {

    if (this.loginForm.valid) {
      alert("Great!!");
    }
  }

  ngOnInit(): void {
  }


}
