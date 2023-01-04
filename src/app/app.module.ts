import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/auth/login/login.component';
import { MapModule } from './components/map/map/map.module';
import { RegistrationComponent } from './components/auth/registration/registration.component';
import { ReactiveFormsModule} from "@angular/forms";
import { FooterComponent } from './components/footer/footer.component';
import {  HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from './components/auth/interceptor/interceptor.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegistrationComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MapModule,
    HttpClientModule,

  ],
  providers: [  
    {
    provide: HTTP_INTERCEPTORS,
    useClass: Interceptor,
    multi: true,
  }, ],
  bootstrap: [AppComponent]
})
export class AppModule { }
