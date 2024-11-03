import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetPasswordPageRoutingModule } from './reset-password-routing.module';

import { ResetPasswordPage } from './reset-password.page';
import { MessageComponent } from 'src/app/components/message/message.component';

@NgModule({
  imports: [
    CommonModule,
    MessageComponent,
    FormsModule,
    IonicModule,
    ResetPasswordPageRoutingModule
  ],
  declarations: [ResetPasswordPage]
})
export class ResetPasswordPageModule {}
