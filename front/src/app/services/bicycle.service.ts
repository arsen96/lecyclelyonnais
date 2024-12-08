import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, finalize, tap,map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { Bicycle } from '../models/bicycle';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class BicycleService extends BaseService {
  allBicycles:Bicycle[] = [];
  userBicycles:Bicycle[] = [];
  public globalService: GlobalService = inject(GlobalService);
  bicyclesLoaded:ReplaySubject<boolean> = new ReplaySubject<boolean>(0); 

  constructor(private http: HttpClient) { 
    super();
    this.getBicycles().subscribe();
  }

  getBicycles() {
    return this.http.get<any>(`${this.baseApi}/bicycles/get`).pipe(
      tap((res: any) => { 
        this.allBicycles = res.data;
        console.log('allBicycles',this.allBicycles);
        this.bicyclesLoaded.next(true); 
      }),
      catchError((err) => {
        this.bicyclesLoaded.next(false);
        return this.handleError(err);
      }),
      finalize(() => this.bicyclesLoaded.complete())
    );
  }

  addNew(bicycle: Bicycle) {
    return this.http.post<any>(`${this.baseApi}/bicycles/addNew`, bicycle).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  getUserBicycles() {
    if(this.userBicycles.length > 0){
      return of(this.userBicycles);
    }

    return this.http.get<any>(`${this.baseApi}/bicycles/getUserBicycles`).pipe(
      map((res: any) => {
        res.data.forEach((bicycle: any) => {
          bicycle.year = bicycle.c_year;
          delete bicycle.c_year;
        });
        this.userBicycles = res.data;
        return this.userBicycles
      }),
      catchError((err) => this.handleError(err))
    );
  }

  deleteBicycles(ids: number[]) {
    return this.http.post<any>(`${this.baseApi}/bicycles/deleteBicycles`, { ids }).pipe(
      catchError((err) => this.handleError(err))
    );  
  }

  updateBicycle(id: number, bicycle: Bicycle) {
    return this.http.post<any>(`${this.baseApi}/bicycles/updateBicycle`, { id, ...bicycle }).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  resetBicyclesLoaded() {
    this.bicyclesLoaded = new ReplaySubject<boolean>(0);
  }

}
