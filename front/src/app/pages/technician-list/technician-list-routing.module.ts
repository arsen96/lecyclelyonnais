import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TechnicianListPage } from './technician-list.page';

const routes: Routes = [
  {
    path: '',
    component: TechnicianListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TechnicianListPageRoutingModule {}
