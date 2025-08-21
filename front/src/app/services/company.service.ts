// services/company.service.ts - Version avec conservation du domaine
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, finalize, lastValueFrom, map, Observable, of, ReplaySubject } from 'rxjs';
import { BaseService } from './base.service';
import { Company } from '../models/company';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { AuthBaseService } from './auth/auth-base.service';
import { GlobalService, UserRole } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends BaseService {
  companiesLoaded = new ReplaySubject<boolean>(0);
  companies: Company[] = [];
  currentCompany: Company | null = null;
  currentDomain: string | null = null;
  public router = inject(Router);
  public authService = inject(AuthBaseService);
  public globalService = inject(GlobalService);
  private activatedRoute = inject(ActivatedRoute);
  currentRoute = 'companies';
  private initialized = false;

  constructor() {
    super();
    this.currentDomain = this.getDomainFromUrl();
    this.setupNavigationSubscription();
    this.interceptNavigation();
    this.setPageTitle();
  }

  get subdomainREQ(): {domain: string | null} {
    return {domain: this.currentDomain}
  }

  async setPageTitle(): Promise<void> {
    if(this.currentDomain){
      const isCompanyExists = await this.isAllowedDomain();
      if(isCompanyExists){
        document.title = this.currentDomain;
      }
    }
  }

  /**
   * Intercepte toutes les navigations pour ajouter automatiquement le domaine
   */
  private interceptNavigation(): void {
    const originalNavigate = this.router.navigate.bind(this.router);
    const originalNavigateByUrl = this.router.navigateByUrl.bind(this.router);

    this.router.navigate = (commands: any[], extras?: any) => {
      const enhancedExtras = this.addDomainToNavigation(extras);
      return originalNavigate(commands, enhancedExtras);
    };

    this.router.navigateByUrl = (url: any, extras?: any) => {
      const enhancedUrl = this.addDomainToUrl(url.toString());
      return originalNavigateByUrl(enhancedUrl, extras);
    };
  }

  /**
   * Ajoute le domaine aux options de navigation
   */
  private addDomainToNavigation(extras: any = {}): any {
    if (!this.currentDomain) {
      return extras;
    }

    return {
      ...extras,
      queryParams: {
        ...extras.queryParams,
        domain: this.currentDomain
      },
      queryParamsHandling: extras.queryParamsHandling || 'merge'
    };
  }

  /**
   * Ajoute le domaine à une URL
   */
  private addDomainToUrl(url: string): string {
    if (!this.currentDomain) {
      return url;
    }

    const urlObj = new URL(url, window.location.origin);
    urlObj.searchParams.set('domain', this.currentDomain);
    
    // Retourner juste le pathname + search + hash
    return urlObj.pathname + urlObj.search + urlObj.hash;
  }

  /**
   * Navigation avec conservation automatique du domaine
   */
  navigate(commands: any[], extras: any = {}): Promise<boolean> {
    return this.router.navigate(commands, this.addDomainToNavigation(extras));
  }

  /**
   * Navigation par URL avec conservation automatique du domaine
   */
  navigateByUrl(url: string, extras: any = {}): Promise<boolean> {
    const enhancedUrl = this.addDomainToUrl(url);
    return this.router.navigateByUrl(enhancedUrl, extras);
  }

  /**
   * Initialise le service en chargeant les données si nécessaire
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      await this.get();
      this.initialized = true;
    } catch (error) {
      console.error('Error during company service initialization:', error);
      this.initialized = true;
    }
  }

  /**
   * S'assure que le service est initialisé avant utilisation
   */
  async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  /**
   * Configure la surveillance des changements de navigation pour vérifier les domaines
   */
  private setupNavigationSubscription(): void {
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        try {
          const newDomain = this.getDomainFromUrl();
          
          // Si le domaine a changé, recharger les données
          if (newDomain !== this.currentDomain) {
            this.currentDomain = newDomain;
            this.resetCompaniesLoaded();
            await this.initialize();
          }
          
          await this.ensureInitialized();
          
          const allowedDomain = await this.isAllowedDomain();
          
          if (!allowedDomain) {
            console.warn('Domaine non autorisé:', this.currentDomain);
            // this.authService.logout(); // Décommentez si vous voulez déconnecter automatiquement
          }
        } catch (error) {
          console.error('Error during navigation handling:', error);
        }
      }
    });
  }

  /**
   * Extrait le domaine du paramètre URL ?domain=nom
   * @returns Nom du domaine ou null si pas de paramètre
   */
  getDomainFromUrl(): any {
    const urlParams = new URLSearchParams(window.location.search);
    const domain = urlParams.get('domain');
    return domain;
  }

  /**
   * Met à jour le domaine actuel et redirige
   * @param domain Nouveau domaine à utiliser
   */
  setDomain(domain: string | null): void {
    if (domain) {
      localStorage.setItem('currentDomain', domain);
      this.currentDomain = domain;
      
      // Mettre à jour l'URL sans recharger la page
      const url = new URL(window.location.href);
      url.searchParams.set('domain', domain);
      window.history.replaceState({}, '', url.toString());
    } else {
      localStorage.removeItem('currentDomain');
      this.currentDomain = null;
      
      // Supprimer le paramètre de l'URL
      const url = new URL(window.location.href);
      url.searchParams.delete('domain');
      window.history.replaceState({}, '', url.toString());
    }
    
    // Recharger les données pour la nouvelle entreprise
    this.resetCompaniesLoaded();
    this.initialize();
  }

  /**
   * Récupère l'entreprise actuelle basée sur le domaine
   */
  async getCurrentCompany(): Promise<Company | null> {
    try {
      if (this.currentCompany) {
        return this.currentCompany;
      }

      const response = await lastValueFrom(
        this.http.get<{success: boolean, data: Company}>(`${BaseService.baseApi}/${this.currentRoute}/current`, {
          params: this.domainParams
        })
      );

      if (response.success) {
        this.currentCompany = response.data;
        this.setToolbarBackgroundColor();
        return this.currentCompany;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading current company:', error);
      return null;
    }
  }

  /**
   * Valide si un domaine existe
   */
  async validateDomain(domain: string): Promise<{exists: boolean, companyId?: number}> {
    try {
      const response = await lastValueFrom(
        this.http.get<{success: boolean, data: any}>(`${BaseService.baseApi}/${this.currentRoute}/validate`, {
          params: { domain }
        })
      );

      return {
        exists: response.data.exists,
        companyId: response.data.companyId
      };
    } catch (error) {
      console.error('Error validating domain:', error);
      return { exists: false };
    }
  }

  override get(): Promise<Company[]> {
    if (this.companies.length > 0) {
      return lastValueFrom(of(this.companies));
    }

    let params = null;
    if (this.globalService.userRole.getValue() === UserRole.ADMIN) {
      params = this.domainParams;
    }
    
    return lastValueFrom(this.http.get<{}>(`${BaseService.baseApi}/${this.currentRoute}/get`, {
      params: params
    }).pipe(
      map((res: { success: boolean, data: Company[] }) => {
        this.companies = res.data;
        this.companiesLoaded.next(true);
        this.currentCompany = this.companies.find(
          (currentComp) => currentComp.subdomain === this.currentDomain
        ) || null;
        
        if (!this.currentCompany && !this.currentDomain) {
          this.currentCompany = this.companies.find(
            (currentComp) => !currentComp.subdomain
          ) || null;
        }
        
        this.setToolbarBackgroundColor();
        return this.companies;
      }),
      catchError((err) => {
        console.error('Error loading companies:', err);
        this.companiesLoaded.next(false);
        return of([]);
      }),
      finalize(() => {
        this.companiesLoaded.complete();
      })
    ));
  }

  override async create(item: Company): Promise<Company> {
    return lastValueFrom(this.http.post<{success: boolean, data: Company}>(`${BaseService.baseApi}/${this.currentRoute}/create`, item).pipe(
      map((res: {success: boolean, data: Company}) => {
        if (res.success) {
          this.companies.push(res.data);
          return res.data;
        }
        throw new Error("Failed to create company");
      }),
      catchError(BaseService.handleError.bind(this))
    ));
  }

  override async update(item: Company): Promise<Company> {
    return lastValueFrom(this.http.post<{success: boolean, data?: Company}>(`${BaseService.baseApi}/${this.currentRoute}/update`, item).pipe(
      map((res: {success: boolean, data?: Company}) => {
        if (res.success) {
          const index = this.companies.findIndex(c => c.id === item.id);
          if (index !== -1) {
            this.companies[index] = { ...this.companies[index], ...item };
          }
          return this.companies[index] || item;
        }
        throw new Error('Failed to update company');
      }),
      catchError(BaseService.handleError.bind(this))
    ));
  }

  override delete(companyIds: number[]): Observable<void> {
    return this.http.delete(`${BaseService.baseApi}/${this.currentRoute}/delete`, {
      body: {
        ids: companyIds
      }
    }).pipe(
      map((res: any) => {
        this.companies = this.companies.filter(company => !companyIds.includes(company.id));
        return res;
      }),
      catchError(BaseService.handleError.bind(this))
    );
  }

  getCompanyById(companyId: number): Company | undefined {
    return this.companies.find(company => company.id === companyId);
  }

  resetCompaniesLoaded(): void {
    this.companiesLoaded = new ReplaySubject<boolean>(0);
    this.initialized = false;
    this.companies = [];
    this.currentCompany = null;
  }

  /**
   * Paramètres à envoyer avec les requêtes API
   */
  get domainParams(): { domain: string | null } {
    return { domain: this.currentDomain };
  }

  /**
   * Récupère la liste des domaines autorisés
   * @returns Promise avec la liste des domaines
   */
  async allowedDomains(): Promise<(string | null)[]> {
    try {
      await this.ensureInitialized();
      
      if (this.companies.length === 0) {
        await this.get();
      }
      
      const domains = this.companies.map(company => company.subdomain);
      return domains;
    } catch (error) {
      console.error('Error loading allowed domains:', error);
      return [];
    }
  }

  /**
   * Vérifie si le domaine actuel est autorisé
   * @returns Promise avec true si autorisé, false sinon
   */
  async isAllowedDomain(): Promise<boolean> {
    try {
      const allowedDomains = await this.allowedDomains();
      
      if (!allowedDomains || allowedDomains.length === 0) {
        return true;
      }
      
      // Validation en utilisant l'API
      if (this.currentDomain) {
        const validation = await this.validateDomain(this.currentDomain);
        return validation.exists;
      }
      
      // Si pas de domaine, vérifier s'il y a une entreprise par défaut
      return allowedDomains.includes(null);
      
    } catch (error) {
      console.error('Error checking allowed domain:', error);
      return true; // En cas d'erreur, autoriser par défaut
    }
  }

  /**
   * Applique la couleur de thème de l'entreprise actuelle
   */
  setToolbarBackgroundColor(): void {
    if (this.currentCompany && this.currentCompany.theme_color) {
      document.documentElement.style.setProperty('--ion-toolbar-background', this.currentCompany.theme_color);
      document.documentElement.style.setProperty('--ion-item-background', this.currentCompany.theme_color);
      document.documentElement.style.setProperty('--ion-background-color', this.currentCompany.theme_color);
    } else {
      document.documentElement.style.removeProperty('--ion-toolbar-background');
      document.documentElement.style.removeProperty('--ion-item-background');
      document.documentElement.style.removeProperty('--ion-background-color');
    }
  }

  /**
   * Génère l'URL complète avec le domaine spécifié
   * @param domain Domaine à utiliser
   * @param path Chemin optionnel
   * @returns URL complète
   */
  getUrlWithDomain(domain: string | null, path: string = ''): string {
    const baseUrl = window.location.origin;
    const url = new URL(path, baseUrl);
    
    if (domain) {
      url.searchParams.set('domain', domain);
    } else {
      url.searchParams.delete('domain');
    }
    
    return url.toString();
  }

  /**
   * Navigue vers une URL avec le domaine spécifié
   * @param domain Domaine cible
   * @param path Chemin optionnel
   */
  navigateWithDomain(domain: string | null, path: string = '/'): void {
    this.setDomain(domain);
    this.router.navigate([path]);
  }

  /**
   * Liste toutes les entreprises disponibles pour le sélecteur
   */
  async getAvailableCompanies(): Promise<Company[]> {
    try {
      const response = await lastValueFrom(
        this.http.get<{success: boolean, data: Company[]}>(`${BaseService.baseApi}/${this.currentRoute}/get`)
      );
      
      return response.success ? response.data : [];
    } catch (error) {
      console.error('Error loading available companies:', error);
      return [];
    }
  }
}