import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './layout-module/navbar/navbar.component';
import { LoginComponent } from './components/auth/login/login.component';
import { MapModule } from './components/map/map/map.module';
import { RegistrationComponent } from './components/auth/registration/registration.component';
import { ReactiveFormsModule} from "@angular/forms";
import { FooterComponent } from './layout-module/footer/footer.component';
import {  HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from './components/auth/interceptor/interceptor.interceptor';
import { AboutComponent } from './components/about/about.component';
import { compileDirectiveFromMetadata } from '@angular/compiler';
import { VehicleCardsComponent } from './components/vehicle-cards/vehicle-cards.component';
import { LayoutModuleModule } from './layout-module/layout-module.module';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
compileDirectiveFromMetadata

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MapModule,
    LayoutModuleModule,
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
