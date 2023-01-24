import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register-driver',
  templateUrl: './register-driver.component.html',
  styleUrls: ['./register-driver.component.css']
})
export class RegisterDriverComponent {

  constructor(private authService: AuthService, private router: Router) {}
  
  
  vehicles : Array<any> = [
    // {
    //   "id": 1,
    //   "carModel": "audi",
    //   "vehicleType": "STANDARDNO",
    //   "licenseNumber": "NS 010 WQ",
    //   "passengerSeats": 4,
    //   "location": null,
    //   "babyTransport": true,
    //   "petTransport": false
    // },
    // {
    //   "id": 2,
    //   "carModel": "audi",
    //   "vehicleType": "LUKSUZNO",
    //   "licenseNumber": "NS 011 WA",
    //   "passengerSeats": 4,
    //   "location": null,
    //   "babyTransport": true,
    //   "petTransport": true
    // }
  ];
  hasError: boolean = false;
  
  driverRegistrationForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    telephoneNumber: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    vehicle: new FormControl('', [Validators.required])
  });

  onSubmit() {

    var registrationVal = {
      name: this.driverRegistrationForm.value.firstname,
      surname: this.driverRegistrationForm.value.lastname,
      dateOfBirth: this.driverRegistrationForm.value.dateOfBirth,
      username: this.driverRegistrationForm.value.email,
      password: this.driverRegistrationForm.value.password,
      telephoneNumber: this.driverRegistrationForm.value.telephoneNumber,
      confirmPassword: this.driverRegistrationForm.value.confirmPassword,
      address: this.driverRegistrationForm.value.address,
      vehicle : this.driverRegistrationForm.value.vehicle
    };

    console.log(registrationVal);
    if(registrationVal.password===registrationVal.confirmPassword) {
      if (this.driverRegistrationForm.valid) {
        this.authService.driverRegistration(registrationVal).subscribe({
          next: (result) => {
            console.log(result)
            this.router.navigate(['/home']);
            alert("New driver registered!")

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
    this.authService.getVehicles().subscribe({
      next: (result) => {
        this.vehicles = result;
        console.log(this.vehicles);

      },
      error: (error) => {
        console.log(error);
      },
    });

  }
}
