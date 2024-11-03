import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeafletListPageRoutingModule } from './leaflet-list-routing.module';
import {MatTableModule} from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { LeafletListPage } from './leaflet-list.page';
import { MessageComponent } from 'src/app/components/message/message.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatCheckboxModule,
    MessageComponent,
    LeafletListPageRoutingModule
  ],
  declarations: [LeafletListPage]
})
export class LeafletListPageModule {}
