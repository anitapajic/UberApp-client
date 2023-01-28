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
import { compileDirectiveFromMetadata } from '@angular/compiler';
import { LayoutModuleModule } from './layout-module/layout-module.module';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { RideHistoryComponent } from './components/registered-user/ride-history/ride-history.component';
import { UserAccountComponent } from './components/registered-user/user-account/user-account.component';
import { RideHistoryReviewComponent } from './components/registered-user/ride-history-review/ride-history-review.component';
import { ChangeRequestsComponent } from './components/registered-user/change-requests/change-requests.component';
import { RegisterDriverComponent } from './components/auth/register-driver/register-driver.component';
import { BlockUserComponent } from './components/auth/block-user/block-user.component';
import { CreateVehicleComponent } from './components/auth/create-vehicle/create-vehicle.component';
import { NgChartsModule } from 'ng2-charts';
import { ReportComponent } from './components/registered-user/modal-popup/report/report.component';
import { BookRideAgainComponent } from './components/registered-user/modal-popup/book-ride-again/book-ride-again.component';

compileDirectiveFromMetadata

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    ResetPasswordComponent,
    UserAccountComponent,
    RideHistoryReviewComponent,
    ChangeRequestsComponent,
    RegisterDriverComponent,
    BlockUserComponent,
    CreateVehicleComponent,
    ReportComponent,
    BookRideAgainComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MapModule,
    LayoutModuleModule,
    HttpClientModule,
    NgChartsModule
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
