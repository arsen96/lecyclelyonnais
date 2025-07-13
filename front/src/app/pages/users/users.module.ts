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
        apiKey: environment.GOOGLE_MAP_API,
        libraries: ['places']
      })
    },
  ]
})
export class UsersPageModule {}
