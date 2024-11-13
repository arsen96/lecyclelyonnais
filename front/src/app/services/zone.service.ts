import { HttpClient } from '@angular/common/http';
import { Injectable, signal, Signal } from '@angular/core';
import { catchError, map, tap} from 'rxjs/operators';
import { BaseService } from './base.service';
import { lastValueFrom, Observable, of } from 'rxjs';
import { Zones } from '../models/zones';

@Injectable({
  providedIn: 'root'
})
export class ZoneService extends BaseService {
  public allZones: Zones[] = new Array<Zones>(); 

  constructor(private http: HttpClient) { 
    super();
  }

  create(wkt: string, zoneName: string) {
    return this.http.post(`${this.baseApi}/zones/save`, { wkt, zoneName });
  }

  get():Promise<Zones[]> {
    if (this.allZones.length > 0) {
      return lastValueFrom(of(this.allZones))
    }

    return lastValueFrom(this.http.get(`${this.baseApi}/zones/get`).pipe(
      tap((res: any) => {
        res.data.forEach((zone: any) => {
          zone.geojson = JSON.parse(zone.geojson);
        });

      }),
      map((res: any) => {
        this.allZones = res.data; // Cache the data

        console.log("res.data", res.data)
        return res.data;
      }),
      catchError(this.handleError.bind(this))
    ))
  }

  delete(ids: number[]): Observable<void> {
    return this.http.post(`${this.baseApi}/zones/delete`, { ids }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  removeTechnicianFromZone(zoneId:number, technicianId:number): Observable<void> {
    return this.http.post(`${this.baseApi}/zones/removeTechnicianFromZone`, { zoneId, technicianId }).pipe(
      catchError(this.handleError.bind(this))
    );
  }
  addTechnicianToZone(zoneId:number, technicianIds:number[]) {
    return this.http.post(`${this.baseApi}/zones/addTechnicianToZone`, { technician_ids: technicianIds, zone_id: zoneId }).pipe(
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
      catchError(this.handleError.bind(this))
    );
  }

  isAddressInZone(address: string): Observable<boolean> {
    return this.http.post(`${this.baseApi}/zones/isAddressInZone`, { address }).pipe(
      catchError(this.handleError.bind(this))
    );
  } 
}
