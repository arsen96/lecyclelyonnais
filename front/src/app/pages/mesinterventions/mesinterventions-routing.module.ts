import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesinterventionsPage } from './mesinterventions.page';

const routes: Routes = [
  {
    path: '',
    component: MesinterventionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesinterventionsPageRoutingModule {}
