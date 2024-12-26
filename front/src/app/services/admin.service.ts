import { inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
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
  constructor(public http: HttpClient ) { 
    super();
  }

  getAdmins():Promise<Admin[]> {
    return new Promise<Admin[]>((resolve, reject) => { 
      if(this.allAdmins.length > 0) {
        resolve(this.allAdmins)
      } else {
        this.http.get<any>(`${this.baseApi}/${this.currentUrl}/get`).pipe(
          map((res: {success: boolean, data: Admin[]}) => { 
            this.allAdmins = res.data.filter((user) => user.id !== this.globalService.user.getValue()?.id)
            console.log("allAdmins", res)
            resolve(res.data)
          }),
          catchError(this.handleError.bind(this))
        ).subscribe()
      }
    })
  }

  createAdmin(admin: Admin):Observable<void>{
    return this.http.post(`${this.baseApi}/${this.currentUrl}/create`, {...admin,...this.companyService.subdomainREQ}).pipe(
      catchError(this.handleError.bind(this))
    )
  }

  updateAdmin(admin: Admin):Observable<void>{
    return this.http.post(`${this.baseApi}/${this.currentUrl}/update`, admin).pipe(
      catchError(this.handleError.bind(this))
    )
  }

  delete(adminsIds: number[]):Observable<void>{
    console.log("adminsIds", adminsIds)
    return this.http.post(`${this.baseApi}/${this.currentUrl}/delete`, { ids: adminsIds }).pipe(map((res: any) => {
      this.allAdmins.forEach(admin => {
        if(adminsIds.includes(admin.id)){  
          // admin.geographical_zone_id = null;
        }
      });
      return res;
      }),
      catchError(this.handleError.bind(this))
    )
  }

  login(email: string, password: string): Observable<Admin> {
    return this.http.post(`${this.baseApi}/${this.currentUrl}/login`, { email, password,...this.companyService.subdomainREQ }).pipe(
      map((data:any) => {
        this.globalService.isAuthenticated.next(true)
        const user = data.data.user;

        console.log("daaaaaaaaaaaaaaaaa",data)
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
