import { inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Technician } from '../models/technicians';
import {catchError, finalize, lastValueFrom, map, Observable, of, ReplaySubject, tap } from 'rxjs';
import { CompanyService } from './company.service';
import { CRUD } from '../models/crud';

@Injectable({
  providedIn: 'root'
})
export class TechnicianService extends BaseService {
  techniciansLoaded = new ReplaySubject<boolean>(0);
  technicians: Technician[] = [];
  public companyService = inject(CompanyService)
  constructor() {
    super();
    this.get();
   }

  override get():Promise<Technician[]>{
    if (this.technicians.length > 0) {
      return lastValueFrom(of(this.technicians))
    }

    return lastValueFrom(this.http.get(`${BaseService.baseApi}/technicians/get`).pipe(
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


  override create(technician: Technician){
    return lastValueFrom(this.http.post(`${BaseService.baseApi}/technicians/save`, { ...technician, ...this.companyService.subdomainREQ }).pipe(
      map((res: Technician) => {
        this.technicians.push(res);
        return res;
      }),
      catchError(BaseService.handleError.bind(this))
    ))
  }

  override update(technician: Technician){
    return lastValueFrom(this.http.post(`${BaseService.baseApi}/technicians/update`, {...technician,...this.companyService.subdomainREQ}).pipe(
      catchError(BaseService.handleError.bind(this))
    ))
  }

  override delete(techniciansIds: number[]):Observable<void>{
    return this.http.post(`${BaseService.baseApi}/technicians/delete`, { ids: techniciansIds }).pipe(map((res: any) => {
      this.technicians.forEach(technician => {
        if(techniciansIds.includes(technician.id)){  
          technician.geographical_zone_id = null;
        }
      });
      return res;
      }),
      catchError(BaseService.handleError.bind(this))
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
