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
  currentCompany:Company
  currentSubdomain
  public router = inject(Router)
  public authService = inject(AuthBaseService)
  public globalService = inject(GlobalService)
  currentRoute = 'companies';

  constructor() {
    super()
    this.router.events.subscribe(async x => {
      if (x instanceof NavigationEnd) {
        this.currentSubdomain = this.getSubdomain();
        console.log("his.currentSubdomain",this.currentSubdomain)
        const allowedSubdomain = await this.isAllowedSubdomain();
        

        console.log("allowedSubdomainallowedSubdomain",allowedSubdomain)
        if(!allowedSubdomain){
          console.error("CompanyServiceCompanyServiceCompanyService")
          this.authService.logout();
        }
      }
    });
    this.currentSubdomain = this.getSubdomain();
    this.get();
  }

  override get(): Promise<Company[]> {
    if (this.companies.length > 0) {
      return lastValueFrom(of(this.companies));
    }

    let param = null;
    if(this.globalService.userRole.getValue() === UserRole.ADMIN){
      param = this.subdomainREQ
    }
    console.log("isAdminisAdmin",this.globalService.userRole.getValue())
    
    return lastValueFrom(this.http.get<{}>(`${BaseService.baseApi}/${this.currentRoute}/get`,{
      params: param
    }).pipe(
      map((res:{success:boolean,data:Company[]}) => {
        this.companies = res.data;
        console.log("this.companiesthis.companies",this.companies)
        this.companiesLoaded.next(true);
        console.log("this.currentSubdomain",this.currentSubdomain)
        this.currentCompany = this.companies.find((currentComp) => currentComp.subdomain === this.currentSubdomain);
        console.log("this.currentCompany",this.currentCompany)
        this.setToolbarBackgroundColor();
        return this.companies;
      }),
      catchError((err) => {
        console.log("errrrrrr",err)
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
  getCompanyById(companyId: number) {
    return this.companies.find(company => company.id === companyId);
  }

  resetCompaniesLoaded() {
    this.companiesLoaded = new ReplaySubject<boolean>(0);
  }

  get subdomainREQ(){
    return {domain:this.currentSubdomain}
  }

  getSubdomain(): string | null {
    const host = window.location.hostname;
    const subdomain = host.split('.')[0];
    return subdomain !== 'localhost' ? subdomain : null;
  }

  async allowedSubdomains() {
    await this.companiesLoaded;
    try{
      if(this.companies.length === 0){
        await this.get();
      }
      const subdomains = this.companies.map(result => result.subdomain);
      console.log("subdomainssubdomains",subdomains)
      console.log("this.companiesthis.companies",this.companies)
      return subdomains;
    }catch(err){
      console.error("error while recovering companies")
    }
    return null;
  }

  async isAllowedSubdomain() {
    const allowedSubdomains = await this.allowedSubdomains();
    console.log("allowedSubdomainsallowedSubdomains",allowedSubdomains)
    if(!allowedSubdomains){
      return false;
    }
    return allowedSubdomains.includes(this.currentSubdomain);
  }

  setToolbarBackgroundColor() {
    if (this.currentCompany && this.currentCompany.theme_color) {
      document.documentElement.style.setProperty('--ion-toolbar-background', this.currentCompany.theme_color);
      document.documentElement.style.setProperty('--ion-item-background', this.currentCompany.theme_color);
      document.documentElement.style.setProperty('--ion-background-color', this.currentCompany.theme_color);
    }
  }

} 