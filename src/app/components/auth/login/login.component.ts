import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl,
        FormGroup,
        Validators,
        FormBuilder 
      } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  constructor(private authService: AuthService, private router:Router) {}
  hasError: boolean = false;
 
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {

    let loginVal = {
      username: this.loginForm.value.email?.toString(),
      password: this.loginForm.value.password?.toString(),
    };


    if (this.loginForm.valid) {
      this.authService.login(loginVal).subscribe({
        next: (result) => {
          localStorage.setItem('user', JSON.stringify(result));
          this.authService.setUser();
          this.router.navigate(['/home']);

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
