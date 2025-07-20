import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Removed NgbModule due to compatibility issues
import { NgxUiLoaderModule } from 'ngx-ui-loader';

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
    ReactiveFormsModule,
    HttpClientModule,
    NgxUiLoaderModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
