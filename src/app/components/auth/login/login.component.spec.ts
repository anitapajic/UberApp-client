import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [ LoginComponent ]
    })
  });

  beforeEach(() =>{
   fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('form should valid', () =>{
    component.loginForm.controls['email'].setValue('anita@gmail.com');
    component.loginForm.controls['password'].setValue('test');
    expect(component.loginForm.valid).toBeTruthy();
  });


  it('form should be invalid when missing input', () =>{
    component.loginForm.controls['email'].setValue('anita@gmail.com');
    component.loginForm.controls['password'].setValue('');
    expect(component.loginForm.valid).toBeFalsy();
  });

})
