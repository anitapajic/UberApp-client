import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';


import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //LOGIN


  //REGISTRATION

  
  it('should call the registration with existing email and return bad request', () => {
    const register = { 
      name: "Tamara",
      surname: "Dzambic",
      dateOfBirth: "2000-08-04T00:00:00",
      username: "tamara@gmail.com",
      password: "password",
      confirmPassword: "password",
      telephoneNumber: "0645638986",
      address: "Brace Ribnikar 17",
    };
    const errorResponse = { status: 400, error: 'User with that username already exists!' };
    service.registration(register).subscribe(
      (data) => {},
      (error) => {
        expect(error.status).toBe(errorResponse.status);
        expect(error.statusText).toBe(errorResponse.error)
      }
    );

    const request = httpController.expectOne('http://localhost:8085/api/passenger');
    expect(request.request.method).toEqual('POST');
    request.flush(errorResponse, { status: 400, statusText: 'User with that username already exists!' });
  
  });



});
