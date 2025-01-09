import { inject, Injectable } from '@angular/core';
import {  catchError,  map,  tap} from 'rxjs';
import { AuthBaseService } from './auth-base.service';
import { FormLoginModel, FormRegisterModel } from 'src/app/pages/auth/login/login.page';
import { BicycleService } from '../bicycle.service';
import { TechnicianService } from '../technician.service';
import { InterventionService } from '../intervention.service';
import { CompanyService } from '../company.service';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class StandardAuth extends AuthBaseService {
  public companyService = inject(CompanyService)
  currentRoute = 'auth';
  
  constructor(private bicycleService:BicycleService,private technicianService:TechnicianService,private company:CompanyService,private interventionService:InterventionService) {
    super();
   }

   loginStandard(loginCredentials:FormLoginModel): any{
      console.log("loginCredentialsloginCredentials",loginCredentials)
      const value = super.login(loginCredentials,`${BaseService.baseApi}/${this.currentRoute}/login`);
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
        return this.http.post<any>(`${BaseService.baseApi}/${this.currentRoute}/register`,{...form,...this.company.subdomainREQ})
        .pipe(
          catchError(BaseService.handleError)
        )
        .pipe(
          tap(res => {
            if (res) {
              this.bicycleService.userBicycles = [];

              console.log("res.datares.datares.data",res.data)
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
    return this.http.post<any>(`${BaseService.baseApi}/${this.currentRoute}/forgot-password`,{...data,...this.companyService.subdomainREQ}).pipe(
      catchError(BaseService.handleError)
    ).pipe(
      map(data => {
        console.log("datadata",data)
        return data.message
      })
    );
  }

  confirmResetPassword(data:{email:string}){
    return this.http.post<any>(`${BaseService.baseApi}/${this.currentRoute}/reset-password`,data).pipe(
      catchError(BaseService.handleError)
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
    this.globalService.isAuthenticated.next(false);
  }
}
