import { ChangeDetectorRef, Component, computed, effect, inject, signal } from '@angular/core';
import { AuthBaseService } from './services/auth/auth-base.service';
import { StandardAuth } from './services/auth/standard.service';
import { OauthService } from './services/auth/oauth.service';
import { GlobalService } from './services/global.service';
import { combineLatest } from 'rxjs';

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
    { title: 'Zones', url: '/list-zones', icon: 'home', condition: () => true },
    { title: 'Interventions', url: '/interventions', icon: 'home', condition: () => true },
    { title: 'Liste des vélos', url: '/bikes-list', icon: 'home', condition: () => true },
    { title: 'Techniciens', url: '/list-technicien', icon: 'home', condition: () => true },
    { title: 'Actions', url: '/actions', icon: 'home', condition: () => true },
    { title: 'Mes vélos', url: '/bikes-list', icon: 'home', condition: () => true },
    { title: 'Login', url: '/login', icon: 'log-in', condition: () => !localStorage.getItem("access_token") },
    { title: 'Mes interventions', url: '/mesinterventions', icon: 'log-in', condition: () => this.globalService.userRole.getValue() === "technician" },
    { title: 'Planning', url: '/planning-models', icon: 'log-in', condition: () => true },
    { title: 'Liste des modèles de planning', url: '/planning-models-list', icon: 'log-in', condition: () => true },
    { title: 'Déconnexion', url:'/login', icon: 'log-out', condition: () => localStorage.getItem("access_token"), func: () => this.logout() },
  ];

  constructor() {

    combineLatest([
      this.globalService.userRole,
      this.globalService.isAuthenticated
    ]).subscribe(() => {
      this.updateMenu();
    });

  }

  updateMenu(){
     this.appPages.set(this.appPagesFix.filter((page) => page.condition()))
  }


  logout() {
    this.standard.logout();
  }
}
