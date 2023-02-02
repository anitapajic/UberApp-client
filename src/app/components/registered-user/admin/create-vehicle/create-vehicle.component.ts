import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DriverService } from 'src/app/services/driver-vehicle/driver.service';

@Component({
  selector: 'app-create-vehicle',
  templateUrl: './create-vehicle.component.html',
  styleUrls: ['./create-vehicle.component.css']
})
export class CreateVehicleComponent {
  constructor(private driverService: DriverService, private router: Router) {}
  registrationForm = new FormGroup({
    model: new FormControl('', [Validators.required]),
    vehicleType: new FormControl('', [Validators.required]),
    licenseNumber: new FormControl('', [Validators.required]),
    passengerSeats: new FormControl('', [Validators.required]),
    petTransport: new FormControl(false, [Validators.required]),
    babyTransport: new FormControl(false, [Validators.required]),
  });

  back(){
    this.router.navigate(['/register-driver']);

  }

  onSubmit() {
    let registrationVal = {
      model: this.registrationForm.value.model,
      vehicleType: this.registrationForm.value.vehicleType,
      licenseNumber: this.registrationForm.value.licenseNumber,
      passengerSeats: this.registrationForm.value.passengerSeats,
      petTransport: this.registrationForm.value.petTransport,
      babyTransport: this.registrationForm.value.babyTransport,
    }

    console.log(registrationVal)

    if(this.registrationForm.valid){
      this.driverService.createVehicle(registrationVal).subscribe({
        next: (result) => {
          console.log(result);
          this.router.navigate(['/register-driver']);

        },
        error: (error) => {
          console.log(error)
        },
      });
    }

  }
}
