import { ChangeDetectorRef, Component, computed, effect, inject, signal } from '@angular/core';
import { AuthBaseService } from './services/auth/auth-base.service';
import { StandardAuth } from './services/auth/standard.service';
import { OauthService } from './services/auth/oauth.service';
import { GlobalService, UserRole } from './services/global.service';
import { combineLatest } from 'rxjs';
import { CompanyService } from './services/company.service';


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
  public companyService = inject(CompanyService)
  userProfileUrl: string = this.getUserProfileUrl();
  manageCompanies = this.getManageCompanyUrl();
  public appPagesFix: any[] = [
    { title: 'Gestion des zones', url: '/list-zones', icon: 'home', condition: () => this.manageAccess([UserRole.ADMIN])}, 
    { title: 'Mes interventions', url: '/interventions', icon: 'home', condition: () => this.manageAccess([UserRole.CLIENT])},
    { title: 'Mes vélos', url: '/bikes-list', icon: 'home', condition: () => this.manageAccess([UserRole.CLIENT])},
    { title: 'Gestion des techniciens', url: '/list-technicien', icon: 'home', condition: () => this.manageAccess([UserRole.ADMIN]) },
    { title: 'Planifier une intervention', url: '/actions', icon: 'home', condition: () => true},
    { title: 'Mes interventions', url: '/mesinterventions', icon: 'log-in', condition: () => this.manageAccess([UserRole.TECHNICIAN]) },
    { title: 'Gestion du planning', url: '/planning-models-list', icon: 'log-in', condition: () => this.manageAccess([UserRole.ADMIN]) },
    { title: 'Gestion des comptes utilisateurs', url: '/users', icon: 'log-in', condition: () => this.manageAccess([UserRole.ADMIN]) },
    { title: 'Mon profil', url: this.userProfileUrl, icon: 'log-in', tag:"profile", condition: () => this.manageAccess([UserRole.CLIENT]) },
    { title: 'Gestion des administrateurs', url: '/admins-list', icon: 'log-in', condition: () => this.manageAccess([UserRole.ADMIN,UserRole.SUPERADMIN]) },
    { title: 'Gestion des entreprises', url: '/company-list',tag:"company", icon: 'log-in', condition: () => this.manageAccess([UserRole.ADMIN]) },
    { title: 'Connexion', url: '/login', icon: 'log-in', condition: () => !localStorage.getItem("access_token") },
    { title: 'Déconnexion', url: '/login', icon: 'log-out', condition: () => localStorage.getItem("access_token"), func: () => this.logout() },
  ];
  companyName: string = '';

  constructor() {
    combineLatest([
      this.globalService.userRole,
      this.globalService.isAuthenticated,
      this.globalService.user
    ]).subscribe(() => {

      this.updateMenu();
    });
  }

  updateMenu() {
    this.userProfileUrl = this.getUserProfileUrl();
    this.manageCompanies = this.getManageCompanyUrl();
    this.appPages.set(this.appPagesFix.map((page) => {
      if (page.tag === 'profile') {
        page.url = this.userProfileUrl;
      }else if (page.tag === 'company') {
        page.url = this.manageCompanies;
      }
      return page;
    }).filter((page) => page.condition()));
  }

  manageAccess(roles: string[]): boolean {
    return roles.includes(this.globalService.userRole.getValue());
  }

  logout() {
    console.log("testtt")
    this.standard.logout();
  }

  getUserProfileUrl(): string {
    const userId = this.globalService?.user?.getValue()?.id;
    return userId ? `/user/${userId}` : '';
  }

  getManageCompanyUrl(): string {
    const isAdmin = this.globalService?.userRole?.getValue() === UserRole.ADMIN
    return isAdmin ? `/company/${this.companyService?.currentCompany?.id}` : 'company-list';
  }

}
