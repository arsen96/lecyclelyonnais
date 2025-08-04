import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ReplaySubject, throwError } from 'rxjs';
import { CRUD } from '../models/crud';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService implements CRUD<any> {
  public static currentRoute:string;
  public static baseApi = "http://161.97.116.21:3000";
  public http:HttpClient = inject(HttpClient)
  private static disconnect = new ReplaySubject<Boolean>(1);
  public static $disconnect = BaseService.disconnect.asObservable();
  constructor() { }
  public static handleError(error: HttpErrorResponse) {
    let errorMessage: string | Array<string> = 'Une erreur inconnue est survenue!';
    console.log("erreur",error)
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client ou réseau
      errorMessage = `Une erreur est survenue: ${error.error.message}`;
    } else if (error.error && error.error.message) {
      if (!Array.isArray(error.error?.message)) {
        errorMessage = error.error.message;
      } else {
        let message = new Array();
        errorMessage = new Array();
        error.error?.message.forEach((err: any) => {
          if (err) {
            message.push(err)
          }
        })
        errorMessage = message;
      }
    }
    console.log("errorMessage",errorMessage)
    if(errorMessage === 'invalidtoken'){
      BaseService.disconnect.next(true);
    }
    return throwError(() => errorMessage);
  }

  abstract create(...args: any[])

  abstract get(...args: any[])

  abstract update(...args: any[])

  abstract delete(...args: any[])

}
