import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { IonicModule } from '@ionic/angular';

import { ActionsPageRoutingModule } from './actions-routing.module';

import { ActionsPage } from './actions.page';
import { MessageComponent } from 'src/app/components/message/message.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    IonicModule,
    MatIconModule,
    ActionsPageRoutingModule,
    MessageComponent
  ],
  declarations: [ActionsPage]
})
export class ActionsPageModule {}
