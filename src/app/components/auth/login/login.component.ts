import { HttpErrorResponse } from '@angular/common/http';
import {Component, OnInit, AfterViewInit} from '@angular/core';
import { FormControl,FormGroup,Validators,FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(private authService: AuthService, private router: Router) {}
  hasError: boolean = false;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {

    var loginVal = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };


    if (this.loginForm.valid) {
      this.authService.login(loginVal).subscribe({
        next: (result) => {
          const res : Map<string, any>= new Map(Object.entries(result));
          var user : Map<string, any> = new Map(Object.entries(res.get("user")));
          localStorage.setItem('user', JSON.stringify(user));
          this.router.navigate(['/home']);
          alert("Welcome, " + user.get("firstname") + " " + user.get("lastname"))

        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            this.hasError = true;
          }
        },
      });
    }

  }

  ngOnInit(): void {
  }


}
