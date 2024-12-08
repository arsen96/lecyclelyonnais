import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesinterventionsPageRoutingModule } from './mesinterventions-routing.module';

import { MesinterventionsPage } from './mesinterventions.page';
import { MatExpansionModule } from '@angular/material/expansion';
import { ImageModalComponent } from '../../components/image-modal/image-modal.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesinterventionsPageRoutingModule,
    MatExpansionModule  
  ],
  declarations: [MesinterventionsPage, ImageModalComponent]
})
export class MesinterventionsPageModule {}
