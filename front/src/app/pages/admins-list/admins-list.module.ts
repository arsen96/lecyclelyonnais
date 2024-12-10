import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminsListPageRoutingModule } from './admins-list-routing.module';

import { AdminsListPage } from './admins-list.page';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,  
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    AdminsListPageRoutingModule
  ],
  declarations: [AdminsListPage]
})
export class AdminsListPageModule {}
