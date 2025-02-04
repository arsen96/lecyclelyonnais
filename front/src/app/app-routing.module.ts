import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { isConnected, manageAccessGuard } from './guards/manage-access.guard';
import { UserRole } from './services/global.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule),
    canActivate: [isConnected],
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
    loadChildren: () => import('./pages/leaflet/leaflet.module').then( m => m.LeafletPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  {
    path: 'zone',
    loadChildren: () => import('./pages/leaflet/leaflet.module').then( m => m.LeafletPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  {
    path: 'list-zones',
    loadChildren: () => import('./pages/leaflet-list/leaflet-list.module').then( m => m.LeafletListPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  {
    path: 'list-technicien',
    loadChildren: () => import('./pages/technician-list/technician-list.module').then( m => m.TechnicianListPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  {
    path: 'technicien',
    loadChildren: () => import('./pages/technician/technician.module').then( m => m.TechnicianPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  {
    path: 'technicien/:id',
    loadChildren: () => import('./pages/technician/technician.module').then( m => m.TechnicianPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.TECHNICIAN,UserRole.ADMIN] }
  },
  {
    path: 'actions',
    loadChildren: () => import('./pages/user/actions/actions.module').then( m => m.ActionsPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.CLIENT] }
  },
  {
    path: 'interventions',
    loadChildren: () => import('./pages/interventions/interventions.module').then( m => m.InterventionsPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.CLIENT] }
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
    loadChildren: () => import('./pages/user/bikes-list/bikes-list.module').then( m => m.BikesListPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.CLIENT] }
  },
  {
    path: 'mesinterventions',
    loadChildren: () => import('./pages/mesinterventions/mesinterventions.module').then( m => m.MesinterventionsPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.TECHNICIAN] }
  },
  {
    path: 'planning-models',
    loadChildren: () => import('./pages/planning-models/planning-models.module').then( m => m.PlanningModelsPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.ADMIN] }
  },
   {
    path: 'planning-models/:id',
    loadChildren: () => import('./pages/planning-models/planning-models.module').then( m => m.PlanningModelsPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  {
    path: 'planning-models-list',
    loadChildren: () => import('./pages/planning-models-list/planning-models-list.module').then( m => m.PlanningModelsListPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then( m => m.UsersPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  {
    path: 'users-list',
    loadChildren: () => import('./pages/users-list/users-list.module').then( m => m.UsersListPageModule)
  },
  {
    path: 'admins',
    loadChildren: () => import('./pages/admins/admins.module').then( m => m.AdminsPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.SUPERADMIN,UserRole.ADMIN] }
  },
  {
    path: 'admins-list',
    loadChildren: () => import('./pages/admins-list/admins-list.module').then( m => m.AdminsListPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.ADMIN,UserRole.SUPERADMIN] }
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then( m => m.UsersPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  {
    path: 'user/:id',
    loadChildren: () => import('./pages/users/users.module').then( m => m.UsersPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.ADMIN,UserRole.CLIENT] }
  },
  {
    path: 'users-list',
    loadChildren: () => import('./pages/users-list/users-list.module').then( m => m.UsersListPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  {
    path: 'admins/:id',
    loadChildren: () => import('./pages/admins/admins.module').then( m => m.AdminsPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.ADMIN,UserRole.SUPERADMIN] }
  },
  {
    path: 'login-admin',
    loadChildren: () => import('./pages/auth/login-admin/login-admin.module').then( m => m.LoginAdminPageModule),
    canActivate: [isConnected],
  },
  {
    path: 'company-list',
    loadChildren: () => import('./pages/company-list/company-list.module').then( m => m.CompanyListPageModule),
    canActivate: [manageAccessGuard],
    data: { roles: [UserRole.SUPERADMIN] }
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
