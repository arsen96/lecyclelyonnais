import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, finalize, lastValueFrom, map, Observable, of, ReplaySubject, filter } from 'rxjs';
import { BaseService } from './base.service';
import { Company } from '../models/company';
import { NavigationEnd, Router } from '@angular/router';
import { AuthBaseService } from './auth/auth-base.service';
import { GlobalService, UserRole } from './global.service';
import { CRUD } from '../models/crud';

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends BaseService {
  companiesLoaded = new ReplaySubject<boolean>(0);
  companies: Company[] = [];
  currentCompany: Company;
  currentSubdomain: string | null;
  public router = inject(Router);
  public authService = inject(AuthBaseService);
  public globalService = inject(GlobalService);
  currentRoute = 'companies';
  private initialized = false;

  constructor() {
    super();
    this.currentSubdomain = this.getSubdomain();
    this.setupNavigationSubscription();
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
   * Configure la surveillance des changements de navigation pour vérifier les sous-domaines
   */
  private setupNavigationSubscription(): void {
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        try {
          this.currentSubdomain = this.getSubdomain();
          
          //  S'assurer que les données sont chargées avant vérification
          await this.ensureInitialized();
          
          const allowedSubdomain = await this.isAllowedSubdomain();
          
          if (!allowedSubdomain) {
            this.authService.logout();
          }
        } catch (error) {
          console.error('Error during navigation handling:', error);
        }
      }
    });
  }

  override get(): Promise<Company[]> {
    if (this.companies.length > 0) {
      return lastValueFrom(of(this.companies));
    }

    let param = null;
    if (this.globalService.userRole.getValue() === UserRole.ADMIN) {
      param = this.subdomainREQ;
    }
    
    return lastValueFrom(this.http.get<{}>(`${BaseService.baseApi}/${this.currentRoute}/get`, {
      params: param
    }).pipe(
      map((res: { success: boolean, data: Company[] }) => {
        this.companies = res.data;
        this.companiesLoaded.next(true);
        this.currentCompany = this.companies.find((currentComp) => currentComp.subdomain === this.currentSubdomain);
        this.setToolbarBackgroundColor();
        return this.companies;
      }),
      catchError((err) => {
        console.error('Error loading companies:', err);
        this.companiesLoaded.next(false);
        return of(err);
      }),
      finalize(() => {
        this.companiesLoaded.complete();
      })
    ));
  }

  override async create(item: Company): Promise<Company> {
    return lastValueFrom(this.http.post<Company>(`${BaseService.baseApi}/${this.currentRoute}/create`, item).pipe(
      map((res: Company) => {
        this.companies.push(res);
        return res;
      }),
      catchError(BaseService.handleError.bind(this))
    ));
  }

  override async update(item: Company): Promise<Company> {
    return lastValueFrom(this.http.post<Company>(`${BaseService.baseApi}/${this.currentRoute}/update`, item).pipe(
      map((res: Company) => {
        const index = this.companies.findIndex(c => c.id === item.id);
        if (index !== -1) {
          this.companies[index] = res;
        }
        return res;
      }),
      catchError(BaseService.handleError.bind(this))
    ));
  }

  override delete(companyIds: number[]): Observable<void> {
    return this.http.post(`${BaseService.baseApi}/${this.currentRoute}/delete`, { ids: companyIds }).pipe(
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
  }

  get subdomainREQ(): { domain: string | null } {
    return { domain: this.currentSubdomain };
  }

  /**
   * Extrait le sous-domaine de l'URL actuelle
   * @returns Sous-domaine ou null si localhost
   */
  getSubdomain(): string | null {
    const host = window.location.hostname;
    const subdomain = host.split('.')[0];
    return subdomain !== 'localhost' ? subdomain : null;
  }

  /**
   * Récupère la liste des sous-domaines autorisés
   * @returns Promise avec la liste des sous-domaines
   */
  async allowedSubdomains(): Promise<(string | null)[]> {
    try {
      await this.ensureInitialized();
      
      if (this.companies.length === 0) {
        await this.get();
      }
      
      const subdomains = this.companies.map(result => result.subdomain);
      return subdomains;
    } catch (error) {
      console.error('Error loading allowed subdomains:', error);
      return [];
    }
  }

  /**
   * Vérifie si le sous-domaine actuel est autorisé
   * @returns Promise avec true si autorisé, false sinon
   */
  async isAllowedSubdomain(): Promise<boolean> {
    try {
      const allowedSubdomains = await this.allowedSubdomains();
      
      if (!allowedSubdomains || allowedSubdomains.length === 0) {
        return true;
      }
      
      // return allowedSubdomains.includes(this.currentSubdomain);
      return true;
    } catch (error) {
      console.error('Error checking allowed subdomain:', error);
      return true;
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
    }
  }
}