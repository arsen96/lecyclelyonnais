import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanningModelsListPageRoutingModule } from './planning-models-list-routing.module';

import { PlanningModelsListPage } from './planning-models-list.page';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanningModelsListPageRoutingModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatPaginatorModule    
  ],
  declarations: [PlanningModelsListPage]
})
export class PlanningModelsListPageModule {}
