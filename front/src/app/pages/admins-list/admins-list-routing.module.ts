import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminsListPage } from './admins-list.page';

const routes: Routes = [
  {
    path: '',
    component: AdminsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminsListPageRoutingModule {}
