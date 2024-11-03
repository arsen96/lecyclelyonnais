import { HttpClient } from '@angular/common/http';
import { Injectable, signal, Signal } from '@angular/core';
import { catchError, map, tap} from 'rxjs/operators';
import { BaseService } from './base.service';
import { lastValueFrom, of } from 'rxjs';
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

  delete(ids: number[]) {
    return this.http.post(`${this.baseApi}/zones/delete`, { ids }).pipe(
      catchError(this.handleError.bind(this))
    );
  }
}
