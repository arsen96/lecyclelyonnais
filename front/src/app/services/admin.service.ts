import { inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Admin } from '../models/admin';
import { AuthBaseService } from './auth/auth-base.service';
import { GlobalService, UserRole } from './global.service';
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

  /**
   * Récupère tous les admins sauf l'utilisateur connecté
   * @returns Promise avec la liste des admins filtrée
   */
  override get():Promise<Admin[]> {
    return new Promise<Admin[]>((resolve, reject) => { 
      if(this.allAdmins.length > 0) {
        resolve(this.allAdmins)
      } else {
        this.http.get<any>(`${BaseService.baseApi}/${this.currentUrl}/get`).pipe(
          map((res: {success: boolean, data: Admin[]}) => { 
            this.allAdmins = res.data.filter((user) => user.id !== this.globalService.user.getValue()?.id)
            if(this.globalService.userRole.getValue() === UserRole.ADMIN){
              this.allAdmins = this.allAdmins.filter((admin) => admin.role === UserRole.ADMIN)
            }
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
    return this.http.delete(`${BaseService.baseApi}/${this.currentUrl}/delete`, {
      body: {
        ids: adminsIds
      }
    }).pipe(
      tap((res: any) => {
        this.allAdmins = this.allAdmins.filter(admin => !adminsIds.includes(admin.id));
      }), 
      catchError(BaseService.handleError.bind(this))
    )
  }

  /**
   * Authentifie un administrateur et configure la session
   * @param email - Email de l'administrateur
   * @param password - Mot de passe de l'administrateur
   * @returns Observable avec les données de l'admin connecté
   */
  login(email: string, password: string): Observable<Admin> {
    return this.http.post(`${BaseService.baseApi}/${this.currentUrl}/login`, { email, password,...this.companyService.subdomainREQ }).pipe(
      map((data:any) => {
        this.authService.setSession(data.token);
        this.globalService.isAuthenticated.next(true)
        const user = data.data.user;
        this.globalService.user.next(user);
        this.globalService.userRole.next(user.role);
        return user;
      }),
      catchError(error => {
        throw error;
      })
    );
  }
}
