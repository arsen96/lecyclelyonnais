import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TechnicianPageRoutingModule } from './technician-routing.module';

import { TechnicianPage } from './technician.page';
import { MessageComponent } from 'src/app/components/message/message.component';
import { Loader } from '@googlemaps/js-api-loader';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { environment } from 'src/environments/environment';
@NgModule({
  imports: [
    NgxGpAutocompleteModule,
    CommonModule,
    MessageComponent,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    TechnicianPageRoutingModule
  ],
  declarations: [TechnicianPage],
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
export class TechnicianPageModule {}
