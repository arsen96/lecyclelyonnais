import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, lastValueFrom, map, shareReplay, tap, throwError } from 'rxjs';
import { AuthBaseService } from './auth-base.service';
import { FormLoginModel, FormRegisterModel } from 'src/app/pages/auth/login/login.page';
import { GlobalService } from '../global.service';
import { User } from 'src/app/models/user';
import { BicycleService } from '../bicycle.service';
import { TechnicianService } from '../technician.service';
import { InterventionService } from '../intervention.service';

@Injectable({
  providedIn: 'root',
})
export class StandardAuth extends AuthBaseService {
  constructor(private bicycleService:BicycleService,private technicianService:TechnicianService,private interventionService:InterventionService) {
    super();
   }
   loginStandard(loginCredentials:FormLoginModel): any{
      const value = super.login(loginCredentials,`${this.baseApi}/auth/login`);
      return value.pipe(
        map((data:any) => {
          this.globalService.isAuthenticated.next(true)
          this.bicycleService.userBicycles = [];
          const user = data.data.user;
          this.globalService.user.next(user);
          this.globalService.userRole.next(user.role);
          return data.token;
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
              this.bicycleService.userBicycles = [];
              this.globalService.user.next(res.data.user);
              this.globalService.userRole.next(res.data.user.role);
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
    this.bicycleService.userBicycles = [];
    this.bicycleService.resetBicyclesLoaded();
    this.technicianService.resetTechniciansLoaded();
    this.technicianService.technicians = [];
    this.interventionService.allInterventions = [];
    console.log("logout")
    this.globalService.isAuthenticated.next(false);
  }
}
