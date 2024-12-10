import { ChangeDetectorRef, Component, computed, effect, inject, signal } from '@angular/core';
import { AuthBaseService } from './services/auth/auth-base.service';
import { StandardAuth } from './services/auth/standard.service';
import { OauthService } from './services/auth/oauth.service';
import { GlobalService } from './services/global.service';
import { combineLatest } from 'rxjs';

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
  TECHNICIAN = 'technician',
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  authService = inject(AuthBaseService);
  cdr  = inject(ChangeDetectorRef);
  oauthService = inject(OauthService);
  standard = inject(StandardAuth)
  appPages = signal<any[]>([])
  public globalService = inject(GlobalService)
  public appPagesFix: any[] = [
    { title: 'Accueil', url: '/home', icon: 'home', condition: () => true },
    { title: 'Zones', url: '/list-zones', icon: 'home', condition: () => this.manageAccess(UserRole.ADMIN) },
    { title: 'Interventions', url: '/interventions', icon: 'home', condition: () => this.manageAccess(UserRole.CLIENT) || this.manageAccess(UserRole.ADMIN) },
    { title: 'Mes vélos', url: '/bikes-list', icon: 'home', condition: () => this.manageAccess(UserRole.CLIENT) },
    { title: 'Techniciens', url: '/list-technicien', icon: 'home', condition: () => this.manageAccess(UserRole.ADMIN) },
    { title: 'Actions', url: '/actions', icon: 'home', condition: () => this.manageAccess(UserRole.CLIENT) },
    { title: 'Mes interventions', url: '/mesinterventions', icon: 'log-in', condition: () => this.manageAccess(UserRole.TECHNICIAN) },
    { title: 'Planning', url: '/planning-models', icon: 'log-in', condition: () => this.manageAccess(UserRole.ADMIN) },
    { title: 'Liste des modèles de planning', url: '/planning-models-list', icon: 'log-in', condition: () => this.manageAccess(UserRole.ADMIN) },
    { title: 'Créer un compte utilisateur', url: '/users', icon: 'log-in', condition: () => this.manageAccess(UserRole.ADMIN) },
    { title: 'Liste des admins', url: '/admins-list', icon: 'log-in', condition: () => this.manageAccess(UserRole.ADMIN) },
    { title: 'Liste des entreprises', url: '/company-list', icon: 'log-in', condition: () => true },
    { title: 'Entreprise', url: '/company', icon: 'log-in', condition: () => true },
    { title: 'Login', url: '/login', icon: 'log-in', condition: () => !localStorage.getItem("access_token") },
    { title: 'Déconnexion', url:'/login', icon: 'log-out', condition: () => localStorage.getItem("access_token"), func: () => this.logout() },

  ];

  constructor() {

    combineLatest([
      this.globalService.userRole,
      this.globalService.isAuthenticated
    ]).subscribe(() => {
      console.log("userRole",this.globalService.userRole.getValue())
      this.updateMenu();
    });

  }

  updateMenu(){
     this.appPages.set(this.appPagesFix.filter((page) => page.condition()))
  }

  manageAccess(role: string): boolean {
    console.log("uuu",this.globalService.userRole.getValue())
    return this.globalService.userRole.getValue() === role;
  }

  logout() {
    this.standard.logout();
  }
}
