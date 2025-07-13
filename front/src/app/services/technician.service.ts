import { inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Technician } from '../models/technicians';
import { catchError, finalize, lastValueFrom, map, Observable, of, ReplaySubject, tap } from 'rxjs';
import { CompanyService } from './company.service';

@Injectable({
  providedIn: 'root'
})
export class TechnicianService extends BaseService {
  techniciansLoaded = new ReplaySubject<boolean>(0);
  technicians: Technician[] = [];
  public companyService = inject(CompanyService);
  private initialized = false;

  constructor() {
    super();
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      await this.get();
      this.initialized = true;
    } catch (error) {
      console.error('Error during technician service initialization:', error);
      this.initialized = true;
    }
  }

  async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  override get(): Promise<Technician[]> {
    if (this.technicians.length > 0) {
      return lastValueFrom(of(this.technicians));
    }

    return lastValueFrom(
      this.http.get(`${BaseService.baseApi}/technicians/get`).pipe(
        map((res: Technician[]) => {
          this.technicians = res;
          this.techniciansLoaded.next(true);
          return this.technicians;
        }),
        catchError((err) => {
          console.error('Error loading technicians:', err);
          this.techniciansLoaded.next(false);
          return of(err);
        }),
        finalize(() => {
          this.techniciansLoaded.complete();
        })
      )
    );
  }

  override create(technician: Technician) {
    return lastValueFrom(
      this.http.post(`${BaseService.baseApi}/technicians/save`, { 
        ...technician, 
        ...this.companyService.subdomainREQ 
      }).pipe(
        map((res: Technician) => {
          this.technicians.push(res);
          return res;
        }),
        catchError(BaseService.handleError.bind(this))
      )
    );
  }

  override update(technician: Technician) {
    return lastValueFrom(
      this.http.post(`${BaseService.baseApi}/technicians/update`, {
        ...technician,
        ...this.companyService.subdomainREQ
      }).pipe(
        map((res: any) => {
          const index = this.technicians.findIndex(t => t.id === technician.id);
          if (index !== -1) {
            this.technicians[index] = { ...this.technicians[index], ...technician };
          }
          return res;
        }),
        catchError(BaseService.handleError.bind(this))
      )
    );
  }

  override delete(techniciansIds: number[]): Observable<void> {
    return this.http.post(`${BaseService.baseApi}/technicians/delete`, { 
      ids: techniciansIds 
    }).pipe(
      map((res: any) => {
        this.technicians.forEach(technician => {
          if (techniciansIds.includes(technician.id)) {
            technician.geographical_zone_id = null;
          }
        });
        return res;
      }),
      catchError(BaseService.handleError.bind(this))
    );
  }

  async getTechnicianById(technicianId: number): Promise<Technician | undefined> {
    await this.ensureInitialized();
    return this.technicians.find(technician => technician.id === technicianId);
  }

  getTechnicianByIdSync(technicianId: number): Technician | undefined {
    return this.technicians.find(technician => technician.id === technicianId);
  }

  async getTechniciansByZone(geographicalZoneId: number): Promise<Technician[]> {
    await this.ensureInitialized();
    return this.technicians.filter(technician => 
      technician.geographical_zone_id === geographicalZoneId
    );
  }

  getTechniciansByZoneSync(geographicalZoneId: number): Technician[] {
    return this.technicians.filter(technician => 
      technician.geographical_zone_id === geographicalZoneId
    );
  }

  resetTechniciansLoaded(): void {
    this.techniciansLoaded = new ReplaySubject<boolean>(0);
    this.initialized = false;
  }

  async reload(): Promise<void> {
    this.technicians = [];
    this.initialized = false;
    this.resetTechniciansLoaded();
    await this.initialize();
  }

  resetCache(): void {
    this.technicians = [];
    this.initialized = false;
    this.resetTechniciansLoaded();
  }

  isLoaded(): boolean {
    return this.initialized && this.technicians.length > 0;
  }
}