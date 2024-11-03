import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Technician } from '../models/technicians';
import { catchError, lastValueFrom, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TechnicianService extends BaseService {

  technicians: Technician[] = [];
  constructor(private http: HttpClient) {
    super();
   }

  get(){
    if (this.technicians.length > 0) {
      return lastValueFrom(of(this.technicians))
    }

    return lastValueFrom(this.http.get(`${this.baseApi}/technicians/get`).pipe(
      map((res: Technician[]) => {
        this.technicians = res; 
        console.log("this.technicians", this.technicians)
        return res;
      }),
      catchError(this.handleError.bind(this))
    ))
  }

  create(technician: Technician){
    return lastValueFrom(this.http.post(`${this.baseApi}/technicians/save`, technician).pipe(
      map((res: Technician) => {
        this.technicians.push(res);
        return res;
      }),
      catchError(this.handleError.bind(this))
    ))
  }

  delete(techniciansIds: number[]){

  }
}
