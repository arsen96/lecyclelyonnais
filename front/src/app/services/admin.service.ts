import { inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { catchError, map, Observable, of } from 'rxjs';
import { Admin } from '../models/admin';
import { AuthBaseService } from './auth/auth-base.service';
import { GlobalService } from './global.service';
import { CompanyService } from './company.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseService {
  currentUrl = 'admins'
  allAdmins: Admin[] = []
  public authService = inject(AuthBaseService);   
  public globalService = inject(GlobalService); 
  public companyService = inject(CompanyService)
  constructor() { 
    super();
  }

  override get():Promise<Admin[]> {
    return new Promise<Admin[]>((resolve, reject) => { 
      if(this.allAdmins.length > 0) {
        resolve(this.allAdmins)
      } else {
        this.http.get<any>(`${BaseService.baseApi}/${this.currentUrl}/get`).pipe(
          map((res: {success: boolean, data: Admin[]}) => { 
            this.allAdmins = res.data.filter((user) => user.id !== this.globalService.user.getValue()?.id)
            console.log("allAdmins", res)
            resolve(res.data)
          }),
          catchError(BaseService.handleError.bind(this))
        ).subscribe()
      }
    })
  }

  override create(admin: Admin):Observable<void>{
    return this.http.post(`${BaseService.baseApi}/${this.currentUrl}/create`, {...admin,...this.companyService.subdomainREQ}).pipe(
      catchError(BaseService.handleError.bind(this))
    )
  }

  override update(admin: Admin):Observable<void>{
    return this.http.post(`${BaseService.baseApi}/${this.currentUrl}/update`, admin).pipe(
      catchError(BaseService.handleError.bind(this))
    )
  }

  override delete(adminsIds: number[]):Observable<void>{
    return this.http.post(`${BaseService.baseApi}/${this.currentUrl}/delete`, { ids: adminsIds }).pipe(map((res: any) => {
      this.allAdmins.forEach(admin => {
        if(adminsIds.includes(admin.id)){  
          // admin.geographical_zone_id = null;
        }
      });
      return res;
      }),
      catchError(BaseService.handleError.bind(this))
    )
  }

  login(email: string, password: string): Observable<Admin> {
    return this.http.post(`${BaseService.baseApi}/${this.currentUrl}/login`, { email, password,...this.companyService.subdomainREQ }).pipe(
      map((data:any) => {
        this.globalService.isAuthenticated.next(true)
        const user = data.data.user;

        this.globalService.user.next(user);
        this.globalService.userRole.next(user.role);
        this.authService.setSession(data.token);
        return user;
      }),
      catchError(error => {
        throw error;
      })
    );
  }
}
