import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, finalize, lastValueFrom, map, Observable, of, ReplaySubject } from 'rxjs';
import { BaseService } from './base.service';
import { Company } from '../models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService  extends BaseService{
  currentRoute = 'companies';
  companiesLoaded = new ReplaySubject<boolean>(0);
  companies: Company[] = [];

  constructor(private http: HttpClient) {
    super()
    this.getCompanies();
  }

  getCompanies() {
    if (this.companies.length > 0) {
      return lastValueFrom(of(this.companies));
    }

    return lastValueFrom(this.http.get<{}>(`${this.baseApi}/${this.currentRoute}/get`).pipe(
      map((res:{success:boolean,data:Company[]}) => {
        this.companies = res.data;
        console.log("this.companiesthis.companies",this.companies)
        this.companiesLoaded.next(true);
        return this.companies;
      }),
      catchError((err) => {
        this.companiesLoaded.next(false);
        return of(err);
      }),
      finalize(() => {
        this.companiesLoaded.complete();
      })
    ));
  }

  create(company: Company) {
    return lastValueFrom(this.http.post<Company>(`${this.baseApi}/${this.currentRoute}/create`, company).pipe(
      map((res: Company) => {
        this.companies.push(res);
        return res;
      }),
      catchError(this.handleError.bind(this))
    ));
  }

  update(company: Company) {
    return lastValueFrom(this.http.post(`${this.baseApi}/${this.currentRoute}/update`, company).pipe(
      catchError(this.handleError.bind(this))
    ));
  }

  delete(companyIds: number[]): Observable<void> {
    return this.http.post(`${this.baseApi}/${this.currentRoute}/delete`, { ids: companyIds }).pipe(
      map((res: any) => {
        this.companies = this.companies.filter(company => !companyIds.includes(company.id));
        return res;
      }),
      catchError(this.handleError.bind(this))
    );
  }

  getCompanyById(companyId: number) {
    return this.companies.find(company => company.id === companyId);
  }

  resetCompaniesLoaded() {
    this.companiesLoaded = new ReplaySubject<boolean>(0);
  }


} 