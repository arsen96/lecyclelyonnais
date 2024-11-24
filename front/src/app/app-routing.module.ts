import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/access-controls.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'actions',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'reset',
    loadChildren: () => import('./pages/auth/reset/reset.module').then( m => m.ResetPageModule)
  },
  {
    path: 'reset-password/:token',
    loadChildren: () => import('./pages/auth/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'address',
    loadChildren: () => import('./pages/user/address/address.module').then( m => m.AddressPageModule)
  },
  {
    path: 'zone/:id',
    loadChildren: () => import('./pages/leaflet/leaflet.module').then( m => m.LeafletPageModule)
  },
  {
    path: 'zone',
    loadChildren: () => import('./pages/leaflet/leaflet.module').then( m => m.LeafletPageModule)
  },
  {
    path: 'list-zones',
    loadChildren: () => import('./pages/leaflet-list/leaflet-list.module').then( m => m.LeafletListPageModule)
  },
  {
    path: 'list-technicien',
    loadChildren: () => import('./pages/technician-list/technician-list.module').then( m => m.TechnicianListPageModule)
  },
  {
    path: 'technicien',
    loadChildren: () => import('./pages/technician/technician.module').then( m => m.TechnicianPageModule)
  },
  {
    path: 'technicien/:id',
    loadChildren: () => import('./pages/technician/technician.module').then( m => m.TechnicianPageModule)
  },
  {
    path: 'actions',
    loadChildren: () => import('./pages/user/actions/actions.module').then( m => m.ActionsPageModule)
  },
  {
    path: 'interventions',
    loadChildren: () => import('./pages/interventions/interventions.module').then( m => m.InterventionsPageModule)
  },

 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
