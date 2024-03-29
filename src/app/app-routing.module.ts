import { NgModule } from '@angular/core';
import { RouterModule, Routes } from 'node_modules/@angular/router';

import { LoginComponent } from './components/auth/login/login.component';
import { MapComponent } from './components/map/map/map.component';
import { RegistrationComponent } from './components/auth/registration/registration.component';
import { ResetPasswordComponent } from './components/registered-user/reset-password/reset-password.component';
import { UserAccountComponent } from './components/registered-user/user-account/user-account.component';
import { RideHistoryReviewComponent } from './components/registered-user/ride-history-review/ride-history-review.component';
import { ChangeRequestsComponent } from './components/registered-user/admin/change-requests/change-requests.component';
import { RegisterDriverComponent } from './components/registered-user/admin/register-driver/register-driver.component';
import { BlockUserComponent } from './components/registered-user/admin/block-user/block-user.component';
import { CreateVehicleComponent } from './components/registered-user/admin/create-vehicle/create-vehicle.component';
import {StatisticsComponent} from "./components/registered-user/admin/statistics/statistics.component";
import {PanicComponent} from "./components/registered-user/admin/panic/panic.component";


const routes: Routes = [
  {path : 'login', component: LoginComponent},
  {path : 'reset-code', component: ResetPasswordComponent},
  {path : 'register', component: RegistrationComponent},
  {path : 'home', component: MapComponent},
  {path : 'account', component: UserAccountComponent},
  {path : 'ride-history-review', component: RideHistoryReviewComponent},
  {path : 'change-requests', component: ChangeRequestsComponent },
  {path : 'register-driver', component: RegisterDriverComponent },
  {path : 'create-vehicle', component: CreateVehicleComponent },
  {path : 'block-user', component: BlockUserComponent },
  {path: 'statistics', component: StatisticsComponent },
  {path : 'panic', component: PanicComponent},
  {path : '**', component: MapComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class  AppRoutingModule { }
