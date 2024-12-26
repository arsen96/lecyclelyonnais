import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Technician } from '../models/technicians';
import {catchError, finalize, lastValueFrom, map, Observable, of, ReplaySubject, tap } from 'rxjs';
import { CompanyService } from './company.service';

@Injectable({
  providedIn: 'root'
})
export class TechnicianService extends BaseService {
  techniciansLoaded = new ReplaySubject<boolean>(0);
  technicians: Technician[] = [];
  public companyService = inject(CompanyService)
  constructor(private http: HttpClient) {
    super();
    this.getTechnicians();
   }

  getTechnicians(){
    if (this.technicians.length > 0) {
      return lastValueFrom(of(this.technicians))
    }

    return lastValueFrom(this.http.get(`${this.baseApi}/technicians/get`).pipe(
      map((res: Technician[]) => {
        this.technicians = res
        this.techniciansLoaded.next(true);
        return this.technicians;
      }),
      catchError((err) => {
        this.techniciansLoaded.next(false);
        return of(err);
      }),
      finalize(() => {
        this.techniciansLoaded.complete();
      })
    ))
  }


  create(technician: Technician){
    return lastValueFrom(this.http.post(`${this.baseApi}/technicians/save`, { ...technician, ...this.companyService.subdomainREQ }).pipe(
      map((res: Technician) => {
        this.technicians.push(res);
        return res;
      }),
      catchError(this.handleError.bind(this))
    ))
  }

  update(technician: Technician){
    console.log("technician", technician)
    return lastValueFrom(this.http.post(`${this.baseApi}/technicians/update`, {...technician,...this.companyService.subdomainREQ}).pipe(
      catchError(this.handleError.bind(this))
    ))
  }

  delete(techniciansIds: number[]):Observable<void>{
    console.log("techniciansIds", techniciansIds)
    return this.http.post(`${this.baseApi}/technicians/delete`, { ids: techniciansIds }).pipe(map((res: any) => {
      this.technicians.forEach(technician => {
        if(techniciansIds.includes(technician.id)){  
          technician.geographical_zone_id = null;
        }
      });
      return res;
      }),
      catchError(this.handleError.bind(this))
    )
  }

  getTechnicianById(technicianId: number){
    return this.technicians.find(technician => technician.id === technicianId)
  }

  getTechniciansByZone(geographicalZoneId: number){
    return this.technicians.filter(technician => technician.geographical_zone_id === geographicalZoneId)
  }

  resetTechniciansLoaded() {
    this.techniciansLoaded = new ReplaySubject<boolean>(0);
  }

}
