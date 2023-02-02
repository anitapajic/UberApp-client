import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Vehicle } from 'src/app/model/Vehicle';
import { DriverService } from 'src/app/services/driver-vehicle/driver.service';

@Component({
  selector: 'app-register-driver',
  templateUrl: './register-driver.component.html',
  styleUrls: ['./register-driver.component.css']
})
export class RegisterDriverComponent {

  constructor(private driverService: DriverService, private router: Router) {}
  
  
  vehicles : Array<Vehicle> = [ ];
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

    let registrationVal = {
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
        this.driverService.driverRegistration(registrationVal).subscribe({
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

  createVehicle(){
    console.log("create vehicle")
    this.router.navigate(['/create-vehicle']);
  }

  ngOnInit(): void {
    this.driverService.getVehicles().subscribe({
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
