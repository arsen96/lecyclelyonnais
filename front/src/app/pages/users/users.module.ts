import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';
import { UsersPage } from './users.page';
import { Loader } from '@googlemaps/js-api-loader';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { MessageComponent } from 'src/app/components/message/message.component';
@NgModule({
  imports: [
    NgxGpAutocompleteModule,
    CommonModule,
    FormsModule,
    IonicModule,
    MessageComponent,
    ReactiveFormsModule,
    UsersPageRoutingModule
  ],
  declarations: [UsersPage],
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
export class UsersPageModule {}
