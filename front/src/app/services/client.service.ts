import { Injectable } from '@angular/core';
import { AuthBaseService } from './auth/auth-base.service';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { CRUD } from '../models/crud';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends BaseService {
  allClients:User[] = [];   
  public currentRoute = 'clients';
  constructor() { 
    super();
  }

  override get():Promise<any>{
    return new Promise((resolve, reject) => {
      if(this.allClients.length > 0){
        resolve(true);
        return;
      }
      
      this.http.get<any>(`${BaseService.baseApi}/${this.currentRoute}/clients`).pipe(       
      ).subscribe({
        next: (res) => {
          this.allClients = res.data;
          console.log(this.allClients);
          resolve(true);
        },
        error: (err) => reject(err)
      })
    })
  }

  override update(client:User){
    return this.http.put<any>(`${BaseService.baseApi}/${this.currentRoute}/clients/${client.id}`,client).pipe(
    )
  }

  override create(clientIds:number[]){
    return this.http.post<any>(`${BaseService.baseApi}/${this.currentRoute}/clients/delete`,{ids:clientIds}).pipe(
    )
  }   

  override delete():any{
    // TODO
  }
}
