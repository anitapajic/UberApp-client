import {Component, OnInit} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl,FormGroup,Validators,FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit{

  constructor(private authService: AuthService, private router: Router) {}
  hasError: boolean = false;
  registrationForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    telephoneNumber: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
  });

  onSubmit() {

    var registrationVal = {
      name: this.registrationForm.value.firstname,
      surname: this.registrationForm.value.lastname,
      dateOfBirth: this.registrationForm.value.dateOfBirth,
      username: this.registrationForm.value.email,
      password: this.registrationForm.value.password,
      telephoneNumber: this.registrationForm.value.telephoneNumber,
      confirmPassword: this.registrationForm.value.confirmPassword,
      address: this.registrationForm.value.address,
    };

    if(registrationVal.password===registrationVal.confirmPassword) {
      if (this.registrationForm.valid) {
        this.authService.registration(registrationVal).subscribe({
          next: (result) => {
            const user: Map<string, any> = new Map(Object.entries(result));
            localStorage.setItem('user', JSON.stringify(user));
            this.router.navigate(['/home']);
            alert("Activate your account! " + user.get("name") + " " + user.get("surname"))

          },
          error: (error) => {
            if (error instanceof HttpErrorResponse) {
              this.hasError = true;
            }
          },
        });
      }
    }
    else {
      alert("Your password is not the same as the confirmed one!")
    }
  }
  ngOnInit(): void {
  }
}
