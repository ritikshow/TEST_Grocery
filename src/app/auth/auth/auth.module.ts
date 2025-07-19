import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './page/login/login.component';
import { ForgetComponent } from './page/forget/forget.component';
import { ResetComponent } from './page/reset/reset.component';


@NgModule({
  declarations: [
   
    LoginComponent,
    ForgetComponent,
    ResetComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
