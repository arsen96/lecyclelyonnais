import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanningModelsListPage } from './planning-models-list.page';

const routes: Routes = [
  {
    path: '',
    component: PlanningModelsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanningModelsListPageRoutingModule {}
