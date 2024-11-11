import { ChangeDetectorRef, Component, computed, effect, inject, signal } from '@angular/core';
import { AuthBaseService } from './services/auth/auth-base.service';
import { StandardAuth } from './services/auth/standard.service';
import { OauthService } from './services/auth/oauth.service';
import { GlobalService } from './services/global.service';

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
    { title: 'Techniciens', url: '/list-technicien', icon: 'home', condition: () => true },
    { title: 'Actions', url: '/actions', icon: 'home', condition: () => true },
    { title: 'Login', url: '/login', icon: 'log-in', condition: () => !localStorage.getItem("access_token") },
    { title: 'Déconnexion', url:'/login', icon: 'log-out', condition: () => localStorage.getItem("access_token"), func: () => this.logout() },
  ];

  constructor() {
    this.globalService.isAuthenticated.subscribe((a) => {
      this.updateMenu()
    })

  }

  updateMenu(){
     this.appPages.set(this.appPagesFix.filter((page) => page.condition()))
  }


  logout() {
    this.standard.logout();
  }
}
