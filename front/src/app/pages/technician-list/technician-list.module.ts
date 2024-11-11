import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TechnicianListPageRoutingModule } from './technician-list-routing.module';

import { TechnicianListPage } from './technician-list.page';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule    } from '@angular/material/paginator';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatCheckboxModule,
    MatPaginatorModule,
    TechnicianListPageRoutingModule
  ],
  declarations: [TechnicianListPage]
})
export class TechnicianListPageModule {}
