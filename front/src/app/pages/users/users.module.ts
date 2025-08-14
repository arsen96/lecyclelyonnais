import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';
import { UsersPage } from './users.page';
import { Loader } from '@googlemaps/js-api-loader';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { MessageComponent } from 'src/app/components/message/message.component';
import { environment } from 'src/environments/environment';
import { AddressAutocompleteComponent } from 'src/app/components/address-autocomplete/address-autocomplete.component';
@NgModule({
  imports: [
    NgxGpAutocompleteModule,
    CommonModule,
    FormsModule,
    IonicModule,
    MessageComponent,
    ReactiveFormsModule,
    UsersPageRoutingModule,
    AddressAutocompleteComponent
  ],
  declarations: [UsersPage]
})
export class UsersPageModule {}
