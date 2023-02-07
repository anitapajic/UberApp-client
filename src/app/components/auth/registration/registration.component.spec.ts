import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegistrationComponent } from './registration.component';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [ RegistrationComponent ]
    })
  });

  beforeEach(() =>{
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should valid', () =>{
    component.registrationForm.controls['firstname'].setValue('Anita');
    component.registrationForm.controls['lastname'].setValue('Pajic');
    component.registrationForm.controls['email'].setValue('anita@gmail.com');
    component.registrationForm.controls['dateOfBirth'].setValue('25.09.2001.');
    component.registrationForm.controls['password'].setValue('123');
    component.registrationForm.controls['confirmPassword'].setValue('123');
    component.registrationForm.controls['telephoneNumber'].setValue('0669024480');
    component.registrationForm.controls['address'].setValue('Strumicka 6');
    expect(component.registrationForm.valid).toBeTruthy();
  });


  it('form should be invalid when missing input', () =>{
    component.registrationForm.controls['firstname'].setValue('Anita');
    component.registrationForm.controls['lastname'].setValue('Pajic');
    component.registrationForm.controls['email'].setValue('anita@gmail.com');
    component.registrationForm.controls['dateOfBirth'].setValue('');
    component.registrationForm.controls['password'].setValue('123');
    component.registrationForm.controls['confirmPassword'].setValue('');
    component.registrationForm.controls['telephoneNumber'].setValue('0669024480');
    component.registrationForm.controls['address'].setValue('Strumicka 6');
    expect(component.registrationForm.valid).toBeFalsy();
  });

  
  it('form where password and confirmPassword do not match', () =>{
    component.registrationForm.controls['firstname'].setValue('Anita');
    component.registrationForm.controls['lastname'].setValue('Pajic');
    component.registrationForm.controls['email'].setValue('anita@gmail.com');
    component.registrationForm.controls['dateOfBirth'].setValue('25.09.2001.');
    component.registrationForm.controls['password'].setValue('123');
    component.registrationForm.controls['confirmPassword'].setValue('1234');
    component.registrationForm.controls['telephoneNumber'].setValue('0669024480');
    component.registrationForm.controls['address'].setValue('Strumicka 6');
    expect(component.passMatch).toBeFalse();
  });


});
