import { Injectable } from '@angular/core';
import { AuthBaseService } from './auth/auth-base.service';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends AuthBaseService{
  currentRoute:string = 'clients';    
  allClients:User[] = [];   
  constructor() { 
    super();
  }

  getClients(){
    return new Promise((resolve, reject) => {
      if(this.allClients.length > 0){
        resolve(true);
        return;
      }
      
      this.http.get<any>(`${this.baseApi}/${this.currentRoute}/clients`).pipe(       
        catchError(this.handleError)
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


  updateClient(client:User){
    return this.http.put<any>(`${this.baseApi}/${this.currentRoute}/clients/${client.id}`,client).pipe(
      catchError(this.handleError)
    )
  }

  deleteClient(clientIds:number[]){
    return this.http.post<any>(`${this.baseApi}/${this.currentRoute}/clients/delete`,{ids:clientIds}).pipe(
      catchError(this.handleError)
    )
  }   
}
