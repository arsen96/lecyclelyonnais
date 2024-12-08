import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddBikePageRoutingModule } from './bike-routing.module';

import { BikePage } from './bike.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddBikePageRoutingModule
  ],
  declarations: [BikePage]
})
export class BikePageModule {}
