import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  baseApi = "http://localhost:3000";
  constructor() { }
  protected handleError(error: HttpErrorResponse) {
    let errorMessage: string | Array<string> = 'An unknown error occurred!';
    console.log("errorerror",error)
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `An error occurred: ${error.error.message}`;
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


    console.log("errorMessageerrorMessageerrorMessage",errorMessage)
    if(errorMessage === 'invalidtoken'){
      this.unauthenticated();
    }
    return throwError(() => errorMessage);
  }

  public unauthenticated(){

  }
}
