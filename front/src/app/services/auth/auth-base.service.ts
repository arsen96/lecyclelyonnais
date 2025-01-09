import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, shareReplay, Subject, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { GlobalService } from '../global.service';
import { LoadingService } from '../loading.service';
import { BaseService } from '../base.service';

export interface BearerToken {
	token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthBaseService{

  tokenObs:Observable<string> | null;
  router = inject(Router);
  public http = inject(HttpClient)
  public globalService = inject(GlobalService)
  public loadingService = inject(LoadingService)
  private isUserLoadedSubject = new BehaviorSubject<boolean>(false);
  isUserLoaded$ = this.isUserLoadedSubject.asObservable();
  private wasAuthenticated = false;

  constructor(){
    this.wasAuthenticated = !!this.checkIsAuthenicated();
    this.globalService.isAuthenticated.next(this.wasAuthenticated);
    if (!this.wasAuthenticated) {
      localStorage.removeItem("access_token");
      // this.router.navigateByUrl('login')
    }

    this.getUser();
    this.unauthenticated();
  }
  getToken(): string | null {
    const token = localStorage.getItem('authToken');
    return token;
  }

  setSession(token:string){
    console.log("tokentokentoken",token)
    localStorage.setItem("access_token", token);
  }

  public checkIsAuthenicated(){
    const token = localStorage.getItem("access_token");
    if(token){
      const decodedToken = jwtDecode(token);
      const now = Date.now() / 1000;
      const tokenValid =  typeof decodedToken.exp !== 'undefined' && decodedToken.exp > now;
      if (!tokenValid) {
        this.globalService.user.next(null);
        this.globalService.userRole.next(null);
      }
      return tokenValid
    }
    this.globalService.user.next(null);
    this.globalService.userRole.next(null);
    return false;
  }

  login(loginCredentials:any,endpoint:string): Observable<string> {
    if(!this.tokenObs){
      this.tokenObs =  this.http.post<BearerToken>(endpoint,loginCredentials)
      .pipe(catchError(BaseService.handleError.bind(this)))
      .pipe(
        tap(res => {
          if (res) {
            // this.getUserSubject.next(res.data.user);
            this.setSession(res.token);
            this.isUserLoadedSubject.next(true);
          } 
        }),
        map(data => {
          return data
        }),
        shareReplay()
      );
    }
    return this.tokenObs;
  }



  getUser(){
    return new Promise((resolve,reject) => {  
      this.http.get(`${BaseService.baseApi}/auth/user`)
      .pipe(catchError(BaseService.handleError.bind(this)))
      .subscribe({
        next : (res) => {
          this.globalService.user.next(res.data);
          this.globalService.userRole.next(res.data.role);
          resolve(res.data);
            this.isUserLoadedSubject.next(true);
        },
        error : (error) => {
          reject(error);
          this.isUserLoadedSubject.next(true);
        }
      })
    })
  }


  decodeJWT(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }



  logout(){
    console.log("apeee")
    this.tokenObs = null;
    const role = this.globalService.userRole.getValue();
    localStorage.removeItem("access_token");
    if(role === 'admin' || role === 'superadmin'){
      this.router.navigateByUrl("login-admin")
    }else{
      this.router.navigateByUrl("login")
    }
    this.globalService.user.next(null);  
    this.globalService.userRole.next(null);
    this.loadingService.setLoading(false);
  }


  public unauthenticated(): void {
    BaseService.$disconnect.subscribe((result) => {
      console.log("resultresult",result)
      if(result){
        // if (this.wasAuthenticated || force) {
          // this.logout();
          // this.router.navigateByUrl("login");
        // }
      }
     
    })
  }


  


}
