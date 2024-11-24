import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, tap } from 'rxjs/operators';
import { BaseService } from './base.service';
import { Bicycle } from '../models/bicycle';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BicycleService extends BaseService {
  allBicycles:Bicycle[] = [];
  bicyclesLoaded:ReplaySubject<boolean> = new ReplaySubject<boolean>(1); 

  constructor(private http: HttpClient) { 
    super();
    this.get().subscribe();
  }

  get() {
    return this.http.get<any>(`${this.baseApi}/bicycles/get`).pipe(
      tap((res: any) => { 
        console.log("resresres", res)
        this.allBicycles = res.data;
        this.bicyclesLoaded.next(true); 
      }),
      catchError((err) => {
        this.bicyclesLoaded.next(false);
        return this.handleError(err);
      }),
      finalize(() => this.bicyclesLoaded.complete())
    );
  }
}
