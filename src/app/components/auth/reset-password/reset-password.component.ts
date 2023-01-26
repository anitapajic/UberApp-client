import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  
  constructor(private authService: AuthService, private router: Router) {}
  hasError: boolean = false;
  public isSent : boolean = false;

  resetForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
  });


  onSubmit(){
    let mailVal = {
      username: this.resetForm.value.email,
    };

    let resetVal = {
      username: this.resetForm.value.email,
      newPassword: this.resetForm.value.password,
      code: this.resetForm.value.code
    }
    console.log(this.isSent);

    if(!this.isSent){
      if(this.resetForm.value.email){
        this.isSent = !this.isSent;

        this.authService.sendCode(mailVal).subscribe({
          next: (result) => {
              this.isSent = true;
              alert("Check your email")
          },
          error: (error) => {
            if (error instanceof HttpErrorResponse) {
              this.hasError = true;
              alert("User with provided email does not exist")
            }
          },
        });
      }
    }
    else{   

      this.authService.resetPassword(resetVal).subscribe({
        next: (result) => {
            this.isSent = false;
            this.router.navigate(['/home']);
            alert("Password is successfully changed!")
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            alert("Wrong code");
          }
        },
      });
    }

  }


  ngOnInit(): void {
    this.isSent = false;

  }
}
