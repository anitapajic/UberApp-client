import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl,
        FormGroup,
        Validators,
        FormBuilder 
      } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  constructor(private authService: AuthService, private router: Router) {}
  hasError: boolean = false;
 
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {

    var loginVal = {
      username: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };


    if (this.loginForm.valid) {
      this.authService.login(loginVal).subscribe({
        next: (result) => {
          localStorage.setItem('user', JSON.stringify(result));
          this.authService.setUser();
          this.router.navigate(['/home']);
         // alert("Welcome, " + user.get("name") + " " + user.get("surname"))

        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            this.hasError = true;
            alert("User is not active")
          }
        },
      });
    }

  }

  ngOnInit(): void {
  }


}
