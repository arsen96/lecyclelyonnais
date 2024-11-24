import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Intervention } from '../models/intervention';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { lastValueFrom, of, ReplaySubject } from 'rxjs';
import { BicycleService } from './bicycle.service';
import { TechnicianService } from './technician.service';

@Injectable({
  providedIn: 'root'
})
export class InterventionService extends BaseService  {

  allInterventions:Intervention[] = [];
  interventionsLoaded:ReplaySubject<boolean> = new ReplaySubject<boolean>(1); 

  constructor(private http: HttpClient,private bicycleService:BicycleService,private technicianService:TechnicianService ) { 
    super();

    this.getAll();
  } 

  save(form:FormData) {
    return this.http.post<any>(`${this.baseApi}/interventions/save`, form).pipe(
      catchError(this.handleError)
    );
  } 

  async getAll() {
    const [bicycleLoaded, techniciansLoaded] = await Promise.all([
      lastValueFrom(this.bicycleService.bicyclesLoaded),
      lastValueFrom(this.technicianService.techniciansLoaded)
    ]);
    if (this.allInterventions.length > 0) {
      return lastValueFrom(of(this.allInterventions));
    }
    console.log("bicycleLoaded", bicycleLoaded)
    console.log("this.bicycleService.allBicycles", this.bicycleService.allBicycles)
    return lastValueFrom(this.http.get<any>(`${this.baseApi}/interventions/all`).pipe(
      tap((res: any) => {
        res.data = res.data.sort((a, b) => new Date(a.appointment_start).getTime() - new Date(b.appointment_start).getTime()).reverse();
        res.data.forEach((intervention:Intervention) => {
          if(bicycleLoaded){  
            intervention.bicycle = this.bicycleService.allBicycles.find((bicycle) => bicycle.id === (intervention as any).bicycle_id);
            delete (intervention as any).bicycle_id;
          }
          if(techniciansLoaded){
            intervention.technician = this.technicianService.getTechnicianById((intervention as any).technician_id);
            delete (intervention as any).technician_id;
          }
          intervention.type = intervention.type.charAt(0).toUpperCase() + intervention.type.slice(1);
        })
        this.allInterventions = res.data;
        console.log("this.allInterventions", this.allInterventions)
        this.interventionsLoaded.next(true);
      }),
      catchError((err) => {
        this.interventionsLoaded.next(false);
        return this.handleError(err);
      }),
      finalize(() => {
        this.interventionsLoaded.complete();
      })
    ));
  }

  getInterventionsByUser(clientId:number){
    return this.allInterventions.filter((intervention) => intervention.client_id === clientId);
  }

  uploadPhotos(formData: FormData) {
    return this.http.post(`${this.baseApi}/bicycles/upload-photos`, formData);
  }
}
