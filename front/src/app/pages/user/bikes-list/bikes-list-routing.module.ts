import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BikesListPage } from './bikes-list.page';

const routes: Routes = [
  {
    path: '',
    component: BikesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BikesListPageRoutingModule {}
