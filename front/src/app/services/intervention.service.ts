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
export class InterventionService {

  allInterventions: Intervention[] = [];
  interventionsLoaded: Promise<boolean>;
  interventionsLoadedResolver: (value: boolean) => void;
  public http = inject(HttpClient);
  private initialized = false;

  constructor(
    private bicycleService: BicycleService,
    private technicianService: TechnicianService,
    public globalService: GlobalService
  ) {
    this.interventionLoad();
  }

  /**
   * Initialise le service en chargeant les données si nécessaire
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      await this.get();
      this.initialized = true;
    } catch (error) {
      console.error('Error during intervention service initialization:', error);
      this.initialized = true;
    }
  }

  /**
   * S'assure que le service est initialisé avant utilisation
   */
  async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  create(form: FormData) {
    return this.http.post<any>(`${BaseService.baseApi}/interventions/save`, form).pipe(
      catchError(BaseService.handleError)
    );
  }

  /**
   * Récupère toutes les interventions avec enrichissement des données
   * @returns Promise avec les interventions enrichies (vélo et technicien)
   */
  async get(): Promise<Intervention[]> {
    try {
      console.log("Loading interventions...");
      
      const [bicycleLoaded, techniciansLoaded] = await Promise.all([
        lastValueFrom(this.bicycleService.bicyclesLoaded),
        lastValueFrom(this.technicianService.techniciansLoaded),
      ]);

      const buildInterventions = (interventions: Intervention[]) => {
        interventions = interventions.sort((a, b) => 
          new Date(a.appointment_start).getTime() - new Date(b.appointment_start).getTime()
        ).reverse();
        
        interventions.forEach(async (intervention: Intervention) => {
          if (bicycleLoaded) {
            intervention.bicycle = this.bicycleService.allBicycles.find(
              (bicycle) => bicycle.id === (intervention as any).bicycle_id
            );
          }
          
          if (techniciansLoaded) {
            intervention.technician = await this.technicianService.getTechnicianById(
              (intervention as any).technician_id
            );
          }

          intervention.type = intervention.type.charAt(0).toUpperCase() + intervention.type.slice(1);
        });
      };

      if (this.allInterventions.length > 0) {
        buildInterventions(this.allInterventions);
        this.interventionsLoadedResolver(true);
        return this.allInterventions;
      }

      return await lastValueFrom(
        this.http.get<any>(`${BaseService.baseApi}/interventions/all`).pipe(
          tap((res: any) => {
            this.allInterventions = res.data;
            buildInterventions(this.allInterventions);
            this.interventionsLoadedResolver(true);
          }),
          map((res: any) => res.data),
          catchError((err) => {
            console.error('Error loading interventions:', err);
            this.interventionsLoadedResolver(false);
            throw err; 
          })
        )
      );

    } catch (error) {
      console.error('Error in interventions get():', error);
      this.interventionsLoadedResolver(false);
      throw error;
    }
  }

  /**
   * Récupère les interventions d'un client spécifique
   * @param clientId - ID du client
   * @returns Promise avec les interventions du client
   */
  async getInterventionsByUser(clientId: number): Promise<Intervention[]> {
    await this.ensureInitialized();
    return this.allInterventions.filter((intervention) => intervention.client_id === clientId);
  }

  /**
   * Récupère les interventions d'un technicien spécifique
   * @param technicianId - ID du technicien
   * @returns Promise avec les interventions du technicien
   */
  async getInterventionsByTechnician(technicianId: number): Promise<Intervention[]> {
    await this.ensureInitialized();
    return this.allInterventions.filter((intervention) => intervention.technician?.id === technicianId);
  }

  uploadPhotos(formData: FormData) {
    return this.http.post(`${BaseService.baseApi}/bicycles/upload-photos`, formData);
  }

  /**
   * Gère la fin d'une intervention (annulation ou finalisation)
   * @param interventionId - ID de l'intervention
   * @param isCanceled - Si l'intervention est annulée
   * @param comment - Commentaire sur l'intervention
   * @param photos - Photos optionnelles de l'intervention
   */
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

  interventionLoad(): void {
    this.interventionsLoaded = new Promise((resolve) => {
      this.interventionsLoadedResolver = resolve;
    });
  }

  /**
   * Recharge toutes les interventions depuis l'API
   */
  async reload(): Promise<void> {
    this.allInterventions = [];
    this.initialized = false;
    this.interventionLoad();
    await this.initialize();
  }

  /**
   * Efface le cache des interventions
   */
  resetCache(): void {
    this.allInterventions = [];
    this.initialized = false;
    this.interventionLoad();
  }
}