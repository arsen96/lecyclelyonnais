import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanningModelsPage } from './planning-models.page';

const routes: Routes = [
  {
    path: '',
    component: PlanningModelsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanningModelsPageRoutingModule {}
