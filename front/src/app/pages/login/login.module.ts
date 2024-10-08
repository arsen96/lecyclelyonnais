import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { RouterLink } from '@angular/router';
import { CoolSocialLoginButtonsModule } from '@angular-cool/social-login-buttons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessageComponent } from 'src/app/components/message/message.component';
@NgModule({
  imports: [
    CommonModule,
    MessageComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    CoolSocialLoginButtonsModule,
    FontAwesomeModule,
    IonicModule,
    LoginPageRoutingModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
