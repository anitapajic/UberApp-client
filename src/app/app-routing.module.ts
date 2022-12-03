import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegistrationComponent} from './components/registration/registration.component';
import {MapComponent} from "./components/map/map.component";

const routes: Routes = [
  {path: 'register', component: RegistrationComponent},
  {path: 'home', component: MapComponent},
  {path: '**', component: MapComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
