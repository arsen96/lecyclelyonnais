import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
export class InterventionService extends BaseService  {

  allInterventions:Intervention[] = [];
  interventionsLoaded: Promise<boolean>;
  interventionsLoadedResolver: (value: boolean) => void;

  constructor(private http: HttpClient,private bicycleService:BicycleService,private technicianService:TechnicianService,public globalService:GlobalService) { 
    super();
    this.interventionsLoaded = new Promise((resolve) => {
      this.interventionsLoadedResolver = resolve;
    });
    this.getAllInterventions();
  } 

  save(form:FormData) {

    console.log("formformform", form);
    return this.http.post<any>(`${this.baseApi}/interventions/save`, form).pipe(
      catchError(this.handleError)
    );
  } 

  async getAllInterventions() {
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

        console.log("allInterventions", this.allInterventions);
      return lastValueFrom(of(this.allInterventions));
    }
 
    return lastValueFrom(this.http.get<any>(`${this.baseApi}/interventions/all`).pipe(
      tap((res: any) => {
        this.allInterventions = res.data;
        console.log("allInterventions", this.allInterventions);
        buildInterventions(this.allInterventions);
        this.interventionsLoadedResolver(true);
      }),
      catchError((err) => {
        this.interventionsLoadedResolver(false);
        return this.handleError(err);
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
    return this.http.post(`${this.baseApi}/bicycles/upload-photos`, formData);
  }

  manageEndIntervention(interventionId: number, isCanceled: boolean, comment: string, photos?: File[]) {
    const formData = new FormData();

    console.log("interventionId", interventionId);
    formData.append('intervention_id', interventionId.toString());
    formData.append('is_canceled', isCanceled.toString());
    formData.append('comment', comment);
    
    if (photos && photos.length > 0) {
        photos.forEach(photo => formData.append('interventionPhotos', photo));
    }

    return this.http.post(`${this.baseApi}/interventions/manage-end`, formData);
  }


}
