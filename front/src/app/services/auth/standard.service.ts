import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, lastValueFrom, map, shareReplay, tap, throwError } from 'rxjs';
import { AuthBaseService } from './auth-base.service';
import { FormLoginModel, FormRegisterModel } from 'src/app/pages/auth/login/login.page';
import { GlobalService } from '../global.service';

@Injectable({
  providedIn: 'root',
})
export class StandardAuth extends AuthBaseService {

  constructor() {
    super();
   }
   loginStandard(loginCredentials:FormLoginModel): any{
      const value = super.login(loginCredentials,`${this.baseApi}/auth/login`);
      return value.pipe(
        map((data:string) => {
          this.globalService.isAuthenticated.next(true)
          return data;
        })
      )
    }

    register(form:FormRegisterModel){
        return this.http.post<any>(`${this.baseApi}/auth/register`,form)
        .pipe(
          catchError(this.handleError)
        )
        .pipe(
          tap(res => {
            if (res) {
              this.setSession(res.token);
            } 
          }),
          map(data => {
            this.globalService.isAuthenticated.next(true)
            return data.token
          })
        );
  }

  resetPassword(data:{email:string}){
    return this.http.post<any>(`${this.baseApi}/auth/forgot-password`,data).pipe(
      catchError(this.handleError)
    ).pipe(
      map(data => {
        console.log("datadata",data)
        return data.message
      })
    );
  }

  confirmResetPassword(data:{email:string}){
    return this.http.post<any>(`${this.baseApi}/auth/reset-password`,data).pipe(
      catchError(this.handleError)
    ).pipe(
      map(data => {
        console.log("datadata",data)
        return data.message
      })
    );
  }

  override logout(){
    super.logout();
    this.globalService.isAuthenticated.next(false)
  }
}
