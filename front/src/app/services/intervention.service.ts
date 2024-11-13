import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Intervention } from '../models/intervention';
import { catchError, tap } from 'rxjs/operators';
import { lastValueFrom, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterventionService extends BaseService  {

  allInterventions:Intervention[] = [];

  constructor(private http: HttpClient) { 
    super();

    this.getAll();
  } 

  save(form:any) {
    return this.http.post<any>(`${this.baseApi}/interventions/save`, form).pipe(
      catchError(this.handleError)
    );
  } 

  getAll() {
    if (this.allInterventions.length > 0) {
      return lastValueFrom(of(this.allInterventions));
    }

    return lastValueFrom(this.http.get<any>(`${this.baseApi}/interventions/all`).pipe(
      tap((res: any) => {
        this.allInterventions = res.data;
        console.log("this.allInterventions", this.allInterventions)
      }),
      catchError(this.handleError.bind(this))
    ));
  }
}
