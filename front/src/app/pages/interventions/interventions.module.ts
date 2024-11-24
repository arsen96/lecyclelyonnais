import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { InterventionsPageRoutingModule } from './interventions-routing.module';

import { InterventionsPage } from './interventions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InterventionsPageRoutingModule,
    MatExpansionModule
  ],
  declarations: [InterventionsPage]
})
export class InterventionsPageModule {}
