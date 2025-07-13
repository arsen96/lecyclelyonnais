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
import { Loader } from '@googlemaps/js-api-loader';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { LoginPageModule } from '../../auth/login/login.module';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxGpAutocompleteModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MessageComponent,
    IonicModule,
    MatIconModule,
    ActionsPageRoutingModule,
    MessageComponent,
    LoginPageModule
  ],
  declarations: [ActionsPage],
  providers: [
    {
      provide: Loader,
      useValue: new Loader({
        apiKey: environment.GOOGLE_MAP_API,
        libraries: ['places']
      })
    },
  ]
})
export class ActionsPageModule {}
