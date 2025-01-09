import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BaseService } from './base.service';
import { PlanningModel } from '../models/planningModel';
import { CompanyService } from './company.service';
import { CRUD } from '../models/crud';

@Injectable({
  providedIn: 'root'
})
export class PlanningModelService extends BaseService{
  allPlanningModels:PlanningModel[] = [];
  planningModelsLoaded: Promise<boolean>;
  planningModelsLoadedResolver: (value: boolean) => void;
  public companyService = inject(CompanyService)
  currentRoute = '/planning-models';
  
  constructor() { 
    super();
    this.planningModelsLoaded = new Promise((resolve) => {
      this.planningModelsLoadedResolver = resolve;
    });
  }

  override create(data:any): Observable<any> {
    return this.http.post(`${BaseService.baseApi}${this.currentRoute}/save`, {...data,...this.companyService.subdomainREQ}).pipe(
      catchError(BaseService.handleError.bind(this))
    );
  } 

  override get(): Promise<PlanningModel[]> {
    return new Promise<PlanningModel[]>((resolve,reject)=>{
      if(this.allPlanningModels.length > 0){
        resolve(this.allPlanningModels);
      }
      this.http.get(`${BaseService.baseApi}${this.currentRoute}/get`,{
        params: {...this.companyService.subdomainREQ}
      }).pipe(
        catchError(BaseService.handleError.bind(this)),
        tap((res:any)=>{
          res.data.forEach((model:PlanningModel)=>{
            model.available_days = JSON.parse(model.available_days);
          });

          this.allPlanningModels = res.data;
        })
      ).subscribe({ 
        next:(res:any)=>{
          this.allPlanningModels = res.data;
          this.planningModelsLoadedResolver(true);
          resolve(this.allPlanningModels);
        },
        error:(err)=>{
          this.planningModelsLoadedResolver(false);
          reject(err);
        }
      })
    });
  }

  override update(data: any): Observable<any> {
    return this.http.put(`${BaseService.baseApi}${this.currentRoute}/update/${data.id}`, data).pipe(
      catchError(BaseService.handleError.bind(this))
    );
  }

  override delete(ids: number[]): Observable<any> {
    return this.http.post(`${BaseService.baseApi}${this.currentRoute}/delete`, { ids,...this.companyService.subdomainREQ }).pipe(
      map((res: any) => {
        this.allPlanningModels = this.allPlanningModels.filter(model => !ids.includes(model.id));
        return res;
      }),
      catchError(BaseService.handleError.bind(this))
    )
  }
}
