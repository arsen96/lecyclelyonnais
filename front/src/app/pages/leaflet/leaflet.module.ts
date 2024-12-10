import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { LeafletPageRoutingModule } from './leaflet-routing.module';
import { NgxGpAutocompleteModule } from "@angular-magic/ngx-gp-autocomplete";
import { LeafletPage } from './leaflet.page';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { Loader } from '@googlemaps/js-api-loader';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TechnicianModalComponent } from './technician-modal/technician-modal.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { ZoneModalComponent } from './zone-modal/zone-modal.component';


@NgModule({
  imports: [
    NgxGpAutocompleteModule,
    CommonModule,
    LeafletModule,
    IonicModule.forRoot({innerHTMLTemplatesEnabled: true}),
    FormsModule,
    IonicModule,
    LeafletPageRoutingModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatBadgeModule
  ],
  declarations: [LeafletPage, TechnicianModalComponent, ZoneModalComponent],
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
