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
  {
    path: 'liste-velo',
    loadChildren: () => import('./pages/user/bike/bike.module').then( m => m.BikePageModule)
  },
  {
    path: 'velo/:id',
    loadChildren: () => import('./pages/user/bike/bike.module').then( m => m.BikePageModule)
  },
  {
    path: 'bikes-list',
    loadChildren: () => import('./pages/user/bikes-list/bikes-list.module').then( m => m.BikesListPageModule)
  },
  {
    path: 'mesinterventions',
    loadChildren: () => import('./pages/mesinterventions/mesinterventions.module').then( m => m.MesinterventionsPageModule)
  },
  {
    path: 'planning-models',
    loadChildren: () => import('./pages/planning-models/planning-models.module').then( m => m.PlanningModelsPageModule)
  },
   {
    path: 'planning-models/:id',
    loadChildren: () => import('./pages/planning-models/planning-models.module').then( m => m.PlanningModelsPageModule)
  },
  {
    path: 'planning-models-list',
    loadChildren: () => import('./pages/planning-models-list/planning-models-list.module').then( m => m.PlanningModelsListPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'users-list',
    loadChildren: () => import('./pages/users-list/users-list.module').then( m => m.UsersListPageModule)
  },
  {
    path: 'admins',
    loadChildren: () => import('./pages/admins/admins.module').then( m => m.AdminsPageModule)
  },
  {
    path: 'admins-list',
    loadChildren: () => import('./pages/admins-list/admins-list.module').then( m => m.AdminsListPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'user/:id',
    loadChildren: () => import('./pages/users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'users-list',
    loadChildren: () => import('./pages/users-list/users-list.module').then( m => m.UsersListPageModule)
  },
  {
    path: 'admins/:id',
    loadChildren: () => import('./pages/admins/admins.module').then( m => m.AdminsPageModule)
  },
  {
    path: 'login-admin',
    loadChildren: () => import('./pages/auth/login-admin/login-admin.module').then( m => m.LoginAdminPageModule)
  },
  {
    path: 'company-list',
    loadChildren: () => import('./pages/company-list/company-list.module').then( m => m.CompanyListPageModule)
  },
  {
    path: 'company',
    loadChildren: () => import('./pages/company/company.module').then( m => m.CompanyPageModule)
  },
  {
    path: 'company/:id',
    loadChildren: () => import('./pages/company/company.module').then( m => m.CompanyPageModule)
  },
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
