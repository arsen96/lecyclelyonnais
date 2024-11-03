import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeafletListPage } from './leaflet-list.page';

const routes: Routes = [
  {
    path: '',
    component: LeafletListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeafletListPageRoutingModule {}
