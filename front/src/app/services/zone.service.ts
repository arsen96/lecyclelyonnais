import { inject, Injectable, signal, Signal } from '@angular/core';
import { catchError, map, tap} from 'rxjs/operators';
import { BaseService } from './base.service';
import { lastValueFrom, Observable, of } from 'rxjs';
import { Zones } from '../models/zones';
import { CompanyService } from './company.service';

@Injectable({
  providedIn: 'root'
})  
export class ZoneService extends BaseService{
  public companyService = inject(CompanyService)
  public allZones: Zones[] = new Array<Zones>(); 
  currentRoute = 'zones';
  constructor() { 
    super();
  }

  override create(wkt: string, data:{zoneTitle:string,zoneStartTime:string,zoneEndTime:string,zoneSlotDuration:number}):Observable<any> {
    return this.http.post(`${BaseService.baseApi}/${this.currentRoute}/save`, { wkt, ...data });
  }


  override delete(ids: number[]): Observable<void> {
    return this.http.post(`${BaseService.baseApi}/${this.currentRoute}/delete`, { ids }).pipe(
      catchError(BaseService.handleError.bind(this))
    );
  }

  override get(): Promise<Zones[]> {
    if (this.allZones.length > 0) {
      return lastValueFrom(of(this.allZones));
    }

    return lastValueFrom(this.http.get(`${BaseService.baseApi}/${this.currentRoute}/get`, {
      params: { ...this.companyService.subdomainREQ }
    }).pipe(
      tap((res: any) => {
        res.data.forEach((zone: any) => {
          zone.geojson = JSON.parse(zone.geojson);
        });
      }),
      map((res: any) => {
        this.allZones = res.data;

        console.log("allZonesallZonesallZones",this.allZones)
        return res.data;
      }),
      catchError(BaseService.handleError.bind(this))
    ));
  }


  override update(zoneId:number, zoneTitle:string, zoneTypeInterventionMaintenance:number, zoneTypeInterventionRepair:number) {
    return this.http.post(`${BaseService.baseApi}/${this.currentRoute}/update`, { zoneId, zoneTitle, zoneTypeInterventionMaintenance, zoneTypeInterventionRepair }).pipe(
      catchError(BaseService.handleError.bind(this))
    );
  }
  

  removeTechnicianFromZone(zoneId:number, technicianId:number): Observable<void> {
    return this.http.post(`${BaseService.baseApi}/${this.currentRoute}/removeTechnicianFromZone`, { zoneId, technicianId }).pipe(
      catchError(BaseService.handleError.bind(this))
    );
  }
  addTechnicianToZone(zoneId:number, technicianIds:number[]) {
    return this.http.post(`${BaseService.baseApi}/${this.currentRoute}/addTechnicianToZone`, { technician_ids: technicianIds, zone_id: zoneId }).pipe(
      map((res: any) => {
        this.allZones.forEach(zone => {
          if(zone.id === zoneId){  
            zone.technicians.forEach(technician => {
              if(technicianIds.includes(technician.id)){  
                technician.geographical_zone_id = zoneId;
          }
            });
          }
        });
        return res;
    }),
      catchError(BaseService.handleError.bind(this))
    );
  }

  isAddressInZone(address: string): Observable<boolean> {
    return this.http.post(`${BaseService.baseApi}/${this.currentRoute}/isAddressInZone`, { address }).pipe(
      catchError(BaseService.handleError.bind(this))
    );
  } 

  getZoneById(zoneId:number):Zones {
    return this.allZones.find(zone => zone.id === zoneId);
  }


}
