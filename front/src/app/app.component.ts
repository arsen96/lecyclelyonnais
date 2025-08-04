import { ChangeDetectorRef, Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { AuthBaseService } from './services/auth/auth-base.service';
import { StandardAuth } from './services/auth/standard.service';
import { OauthService } from './services/auth/oauth.service';
import { GlobalService, UserRole } from './services/global.service';
import { combineLatest } from 'rxjs';
import { CompanyService } from './services/company.service';
import { InterventionService } from './services/intervention.service';
import { TechnicianService } from './services/technician.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  authService = inject(AuthBaseService);
  cdr  = inject(ChangeDetectorRef);
  oauthService = inject(OauthService);
  standard = inject(StandardAuth)
  appPages = signal<any[]>([])
  public globalService = inject(GlobalService)
  public companyService = inject(CompanyService)
  public interventionService = inject(InterventionService)
  public technicianService = inject(TechnicianService)
  
  userProfileUrl: string = this.getUserProfileUrl();
  manageCompanies = this.getManageCompanyUrl();
  
  // Configuration des pages du menu avec conditions d'accès basées sur les rôles
  public appPagesFix: any[] = [
    { title: 'Gestion des zones', url: '/list-zones', icon: 'home', condition: () => this.manageAccess([UserRole.ADMIN])}, 
    { title: 'Mes interventions', url: '/interventions', icon: 'home', condition: () => this.manageAccess([UserRole.CLIENT])},
    { title: 'Mes vélos', url: '/bikes-list', icon: 'home', condition: () => this.manageAccess([UserRole.CLIENT])},
    { title: 'Gestion des techniciens', url: '/list-technicien', icon: 'home', condition: () => this.manageAccess([UserRole.ADMIN]) },
    { title: 'Planifier une intervention', url: '/actions', icon: 'home', condition: () => this.userAccess()},
    { title: 'Mes interventions', url: '/mesinterventions', icon: 'log-in', condition: () => this.manageAccess([UserRole.TECHNICIAN]) },
    { title: 'Gestion du planning', url: '/planning-models-list', icon: 'log-in', condition: () => this.manageAccess([UserRole.ADMIN]) },
    { title: 'Gestion des comptes utilisateurs', url: '/users', icon: 'log-in', condition: () => this.manageAccess([UserRole.ADMIN]) },
    { title: 'Mon profil', url: this.userProfileUrl, icon: 'log-in', tag:"profile", condition: () => this.manageAccess([UserRole.CLIENT]) },
    { title: 'Gestion des administrateurs', url: '/admins-list', icon: 'log-in', condition: () => this.manageAccess([UserRole.ADMIN,UserRole.SUPERADMIN]) },
    { title: 'Gestion des entreprises', url: '/company-list',tag:"company", icon: 'log-in', condition: () => this.manageAccess([UserRole.ADMIN,UserRole.SUPERADMIN]) },
    { title: 'Connexion', url: '/login', icon: 'log-in', condition: () => !localStorage.getItem("access_token") },
    { title: 'Déconnexion', url: '/login', icon: 'log-out', condition: () => localStorage.getItem("access_token"), func: () => this.logout() },
  ];
  companyName: string = '';

  constructor() {
    // Écoute les changements d'état d'authentification et de rôle pour mettre à jour le menu
    combineLatest([
      this.globalService.userRole,
      this.globalService.isAuthenticated,
      this.globalService.user
    ]).subscribe(() => {
      this.updateMenu();
    });
  }

  async ngOnInit() {
    // Initialisation asynchrone de tous les services au démarrage de l'application
    await Promise.allSettled([
      this.authService.ensureInitialized(),
      this.companyService.ensureInitialized(),
      this.technicianService.ensureInitialized(),
      this.interventionService.ensureInitialized()
    ]);
  }

  /**
   * Met à jour le menu en fonction de l'état actuel de l'utilisateur
   * Gère les URLs dynamiques pour le profil et les entreprises
   */
  updateMenu() {
    this.userProfileUrl = this.getUserProfileUrl();
    this.manageCompanies = this.getManageCompanyUrl();
    this.appPages.set(this.appPagesFix.map((page) => {
      // Mise à jour des URLs dynamiques selon les tags
      if (page.tag === 'profile') {
        page.url = this.userProfileUrl;
      }else if (page.tag === 'company') {
        page.url = this.manageCompanies;
      }
      return page;
    }).filter((page) => page.condition()));
  }

  /**
   * Vérifie si l'utilisateur a accès selon les rôles spécifiés
   * @param roles - Liste des rôles autorisés
   * @returns true si l'utilisateur a un des rôles requis
   */
  manageAccess(roles: string[]): boolean {
    return roles.includes(this.globalService.userRole.getValue());
  }

  /**
   * Vérifie l'accès pour les fonctionnalités client ou utilisateur non connecté
   */
  userAccess():boolean{
    return [UserRole.CLIENT].includes(this.globalService.userRole.getValue() as any) || !this.globalService.userRole.getValue();
  }

  logout() {
    console.log("logout")
    this.standard.logout();
  }

  /**
   * Génère l'URL du profil utilisateur basée sur l'ID de l'utilisateur connecté
   */
  getUserProfileUrl(): string {
    const userId = this.globalService?.user?.getValue()?.id;
    return userId ? `/user/${userId}` : '';
  }

  /**
   * Génère l'URL de gestion des entreprises selon le rôle de l'utilisateur
   */
  getManageCompanyUrl(): string {
    const isAdmin = this.globalService?.userRole?.getValue() === UserRole.ADMIN
    return isAdmin ? `/company/${this.companyService?.currentCompany?.id}` : 'company-list';
  }

}
