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
import { AddressAutocompleteComponent } from 'src/app/components/address-autocomplete/address-autocomplete.component';
@NgModule({
  imports: [
    NgxGpAutocompleteModule,
    CommonModule,
    MessageComponent,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    TechnicianPageRoutingModule,
    AddressAutocompleteComponent
  ],
  declarations: [TechnicianPage],
})
export class TechnicianPageModule {}
