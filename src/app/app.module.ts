import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistrationComponent } from './components/auth/registration/registration.component';
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import {  HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from './services/interceptor/interceptor.interceptor';
import { compileDirectiveFromMetadata } from '@angular/compiler';
import { LayoutModuleModule } from './components/layout-module/layout-module.module';
import { ResetPasswordComponent } from './components/registered-user/reset-password/reset-password.component';
import { UserAccountComponent } from './components/registered-user/user-account/user-account.component';
import { RideHistoryReviewComponent } from './components/registered-user/ride-history-review/ride-history-review.component';
import { ChangeRequestsComponent } from './components/registered-user/admin/change-requests/change-requests.component';
import { RegisterDriverComponent } from './components/registered-user/admin/register-driver/register-driver.component';
import { BlockUserComponent } from './components/registered-user/admin/block-user/block-user.component';
import { CreateVehicleComponent } from './components/registered-user/admin/create-vehicle/create-vehicle.component';
import { NgChartsModule } from 'ng2-charts';
import { ReportComponent } from './components/registered-user/modal-popup/report/report.component';
import { BookRideAgainComponent } from './components/registered-user/modal-popup/book-ride-again/book-ride-again.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { StatisticsComponent } from './components/registered-user/admin/statistics/statistics.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PanicComponent } from './components/registered-user/admin/panic/panic.component';
import { MapModule } from './components/map/map/map.module';
import { RatingsComponent } from './components/registered-user/modal-popup/ratings/ratings.component';

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
    StatisticsComponent,
    PanicComponent,
    RatingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MapModule,
    FormsModule,
    LayoutModuleModule,
    HttpClientModule,
    NgChartsModule,
    LeafletModule,
    MatSnackBarModule
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: Interceptor,
    multi: true,
  }, ],
  bootstrap: [AppComponent],
  exports:[
    MatSnackBarModule
  ]
})
export class AppModule { }
