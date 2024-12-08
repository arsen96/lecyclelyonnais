import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BaseService } from './base.service';
import { PlanningModel } from '../models/planningModel';

@Injectable({
  providedIn: 'root'
})
export class PlanningModelService extends BaseService{
  currentRoute = '/planning-models';
  allPlanningModels:PlanningModel[] = [];
  planningModelsLoaded: Promise<boolean>;
  planningModelsLoadedResolver: (value: boolean) => void;

  constructor(private http: HttpClient) { 
    super();
    this.planningModelsLoaded = new Promise((resolve) => {
      this.planningModelsLoadedResolver = resolve;
    });
  }

  savePlanningModel(data:any): Observable<void> {
    return this.http.post(`${this.baseApi}${this.currentRoute}/save`, data).pipe(
      catchError(this.handleError.bind(this))
    );
  } 

  getPlanningModels(): Promise<PlanningModel[]> {
    return new Promise<PlanningModel[]>((resolve,reject)=>{
      if(this.allPlanningModels.length > 0){
        resolve(this.allPlanningModels);
      }
      this.http.get(`${this.baseApi}${this.currentRoute}/get`).pipe(
        catchError(this.handleError.bind(this)),
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

  updatePlanningModel(data: any): Observable<void> {
    return this.http.put(`${this.baseApi}${this.currentRoute}/update/${data.id}`, data).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  deletePlanningModel(ids: number[]): Observable<void> {
    return this.http.post(`${this.baseApi}${this.currentRoute}/delete`, { ids }).pipe(
      map((res: any) => {
        this.allPlanningModels = this.allPlanningModels.filter(model => !ids.includes(model.id));
        return res;
      }),
      catchError(this.handleError.bind(this))
    )
  }
}
