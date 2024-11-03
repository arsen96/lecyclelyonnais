import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { LeafletPageRoutingModule } from './leaflet-routing.module';
import { NgxGpAutocompleteModule } from "@angular-magic/ngx-gp-autocomplete";
import { LeafletPage } from './leaflet.page';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { Loader } from '@googlemaps/js-api-loader';
@NgModule({
  imports: [
    NgxGpAutocompleteModule,
    CommonModule,
    LeafletModule,
    IonicModule.forRoot({innerHTMLTemplatesEnabled: true}),
    FormsModule,
    IonicModule,
    LeafletPageRoutingModule,
  ],
  declarations: [LeafletPage],
  providers: [
    {
      provide: Loader,
      useValue: new Loader({
        apiKey: 'AIzaSyBkR-iE9z0QmKidHCvMiTEB7Z36rKwxXpQ',
        libraries: ['places']
      })
    },
    //...
  ],
})
export class LeafletPageModule {}
