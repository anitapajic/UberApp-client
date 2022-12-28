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
import {  HttpClientModule } from '@angular/common/http';


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
    AppRoutingModule,
    MapModule,
    HttpClientModule,

  ],
  providers: [  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
