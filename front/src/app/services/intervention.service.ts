import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Intervention } from '../models/intervention';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { lastValueFrom, of, ReplaySubject } from 'rxjs';
import { BicycleService } from './bicycle.service';
import { TechnicianService } from './technician.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class InterventionService  {

  allInterventions:Intervention[] = [];
  interventionsLoaded: Promise<boolean>;
  interventionsLoadedResolver: (value: boolean) => void;
  public http = inject(HttpClient)

  constructor(private bicycleService:BicycleService,private technicianService:TechnicianService,public globalService:GlobalService) { 
    this.interventionLoad();
    this.get();
  } 

  create(form:FormData) {
    return this.http.post<any>(`${BaseService.baseApi}/interventions/save`, form).pipe(
      catchError(BaseService.handleError)
    );
  } 

  async get() {
    console.log("appeeee")
    const [bicycleLoaded, techniciansLoaded] = await Promise.all([
      lastValueFrom(this.bicycleService.bicyclesLoaded),
      lastValueFrom(this.technicianService.techniciansLoaded),
    ]);

      // const bicycleLoaded = await lastValueFrom(this.bicycleService.bicyclesLoaded);
      // const techniciansLoaded = await lastValueFrom(this.technicianService.techniciansLoaded);

      const buildInterventions = (interventions:Intervention[]) => {
        interventions = interventions.sort((a, b) => new Date(a.appointment_start).getTime() - new Date(b.appointment_start).getTime()).reverse();
      interventions.forEach((intervention:Intervention) => {
        if(bicycleLoaded){  
          intervention.bicycle = this.bicycleService.allBicycles.find((bicycle) => bicycle.id === (intervention as any).bicycle_id);
        }
        if(techniciansLoaded){
          intervention.technician = this.technicianService.getTechnicianById((intervention as any).technician_id);
        }

        intervention.type = intervention.type.charAt(0).toUpperCase() + intervention.type.slice(1);
        })

      }

      if (this.allInterventions.length > 0) {
        buildInterventions(this.allInterventions);
        this.interventionsLoadedResolver(true);
      return lastValueFrom(of(this.allInterventions));
    }
 
    return lastValueFrom(this.http.get<any>(`${BaseService.baseApi}/interventions/all`).pipe(
      tap((res: any) => {
        this.allInterventions = res.data;
        buildInterventions(this.allInterventions);
        this.interventionsLoadedResolver(true);
      }),
      catchError((err) => {
        this.interventionsLoadedResolver(false);
        return BaseService.handleError(err);
      }),
      finalize(() => {
        this.interventionsLoadedResolver(false);
      })
      ));
  }

  getInterventionsByUser(clientId:number){
    return this.allInterventions.filter((intervention) => intervention.client_id === clientId);
  }

  getInterventionsByTechnician(technicianId:number){
    return this.allInterventions.filter((intervention) => intervention.technician.id === technicianId);
  }

  uploadPhotos(formData: FormData) {
    return this.http.post(`${BaseService.baseApi}/bicycles/upload-photos`, formData);
  }

  manageEndIntervention(interventionId: number, isCanceled: boolean, comment: string, photos?: File[]) {
    const formData = new FormData();

    formData.append('intervention_id', interventionId.toString());
    formData.append('is_canceled', isCanceled.toString());
    formData.append('comment', comment);
    
    if (photos && photos.length > 0) {
        photos.forEach(photo => formData.append('interventionPhotos', photo));
    }

    return this.http.post(`${BaseService.baseApi}/interventions/manage-end`, formData);
  }

  interventionLoad(){
    this.interventionsLoaded = null;
    this.interventionsLoaded = new Promise((resolve) => {
      this.interventionsLoadedResolver = resolve;
    });
  }


}
