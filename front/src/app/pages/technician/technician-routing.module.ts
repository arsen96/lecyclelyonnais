import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TechnicianPage } from './technician.page';

const routes: Routes = [
  {
    path: '',
    component: TechnicianPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TechnicianPageRoutingModule {}
