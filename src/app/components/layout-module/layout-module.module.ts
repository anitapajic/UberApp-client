import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from '../../app-routing.module';
import { UserNavbarComponent } from './user-navbar/user-navbar.component';
import { DriverNavbarComponent } from './driver-navbar/driver-navbar.component';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';



@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    UserNavbarComponent,
    DriverNavbarComponent,
    AdminNavbarComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  exports : [FooterComponent, NavbarComponent]
})
export class LayoutModuleModule { }
