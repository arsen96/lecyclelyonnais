import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TechnicianPageRoutingModule } from './technician-routing.module';

import { TechnicianPage } from './technician.page';
import { MessageComponent } from 'src/app/components/message/message.component';
import { Loader } from '@googlemaps/js-api-loader';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';

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
        apiKey: 'AIzaSyBkR-iE9z0QmKidHCvMiTEB7Z36rKwxXpQ',
        libraries: ['places']
      })
    },
  ]
})
export class TechnicianPageModule {}
