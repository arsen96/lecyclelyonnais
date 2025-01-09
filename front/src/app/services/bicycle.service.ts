import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, finalize, tap,map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { Bicycle } from '../models/bicycle';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { GlobalService } from './global.service';
import { CRUD } from '../models/crud';

@Injectable({
  providedIn: 'root'
})
export class BicycleService extends BaseService{
  allBicycles:Bicycle[] = [];
  userBicycles:Bicycle[] = [];
  public globalService: GlobalService = inject(GlobalService);
  bicyclesLoaded:ReplaySubject<boolean> = new ReplaySubject<boolean>(0); 

  constructor() { 
    super();
    this.get().subscribe();
  }

  override get():Observable<Bicycle> {
    return this.http.get<any>(`${BaseService.baseApi}/bicycles/get`).pipe(
      tap((res: any) => { 
        this.allBicycles = res.data;
        console.log('allBicycles',this.allBicycles);
        this.bicyclesLoaded.next(true); 
      }),
      catchError((err) => {
        this.bicyclesLoaded.next(false);
        return BaseService.handleError(err);
      }),
      finalize(() => this.bicyclesLoaded.complete())
    );
  }

  override create(bicycle: Bicycle) {
    return this.http.post<any>(`${BaseService.baseApi}/bicycles/addNew`, bicycle).pipe(
      catchError((err) => BaseService.handleError(err))
    );
  }

  getUserBicycles() {
    if(this.userBicycles.length > 0){
      return of(this.userBicycles);
    }

    return this.http.get<any>(`${BaseService.baseApi}/bicycles/getUserBicycles`).pipe(
      map((res: any) => {
        res.data.forEach((bicycle: any) => {
          bicycle.year = bicycle.c_year;
          delete bicycle.c_year;
        });
        this.userBicycles = res.data;
        return this.userBicycles
      }),
      catchError((err) => BaseService.handleError(err))
    );
  }

  override delete(ids: number[]) {
    return this.http.post<any>(`${BaseService.baseApi}/bicycles/deleteBicycles`, { ids }).pipe(
      catchError((err) => BaseService.handleError(err))
    );  
  }

  override update(id: number, bicycle: Bicycle) {
    return this.http.post<any>(`${BaseService.baseApi}/bicycles/updateBicycle`, { id, ...bicycle }).pipe(
      catchError((err) => BaseService.handleError(err))
    );
  }

  resetBicyclesLoaded() {
    this.bicyclesLoaded = new ReplaySubject<boolean>(0);
  }

}
