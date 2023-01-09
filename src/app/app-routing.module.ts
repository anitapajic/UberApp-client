import { NgModule } from '@angular/core';
import { RouterModule, Routes } from 'node_modules/@angular/router';

import { LoginComponent } from './components/auth/login/login.component';
import { MapComponent } from './components/map/map/map.component';
import { RegistrationComponent } from './components/auth/registration/registration.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';

const routes: Routes = [
  {path : 'login', component: LoginComponent},
  {path : 'reset-code', component: ResetPasswordComponent},
  {path : 'register', component: RegistrationComponent},
  {path : 'home', component: MapComponent},
  {path : '**', component: MapComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class  AppRoutingModule { }
