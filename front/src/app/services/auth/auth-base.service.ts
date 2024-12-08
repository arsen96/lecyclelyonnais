import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, shareReplay, Subject, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { jwtDecode } from "jwt-decode";
import { GlobalService } from '../global.service';
import { User } from 'src/app/models/user';

export interface BearerToken {
	token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthBaseService extends BaseService{

  tokenObs:Observable<string> | null;
  http = inject(HttpClient) 
  router = inject(Router);
  public globalService = inject(GlobalService)
  private isUserLoadedSubject = new BehaviorSubject<boolean>(false);
  isUserLoaded$ = this.isUserLoadedSubject.asObservable();

  constructor(){
    super();
    const isAuthenticated = !!this.checkIsAuthenicated();
    this.globalService.isAuthenticated.next(isAuthenticated);
    if (!isAuthenticated) {
      localStorage.removeItem("access_token");
    }

    this.getUser();
  }
  getToken(): string | null {
    const token = localStorage.getItem('authToken');
    return token;
  }

  setSession(token:string){
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
      }
      return tokenValid
    }
    this.globalService.user.next(null);
    return false;
  }

  login(loginCredentials:any,endpoint:string): Observable<string> {
    if(!this.tokenObs){
      this.tokenObs =  this.http.post<BearerToken>(endpoint,loginCredentials)
      .pipe(catchError(this.handleError.bind(this)))
      .pipe(
        tap(res => {
          if (res) {
            console.log("resresres",res)
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
      this.http.get(`${this.baseApi}/auth/user`)
      .pipe(catchError(this.handleError.bind(this)))
      .subscribe({
        next : (res) => {
          console.log("resresres",res)
          this.globalService.user.next(res.data);
          this.globalService.userRole.next(res.data.role);
          setTimeout(() => {
            console.log("userRole",this.globalService.userRole.getValue())
          }, 1000);
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
    this.tokenObs = null;
    this.globalService.user.next(null);  
    localStorage.removeItem("access_token");
    this.router.navigateByUrl("login")
  }


  public override unauthenticated(): void {
      this.logout();
  }

  test(){
    this.http.get(`${this.baseApi}/auth/test`)
    .pipe(catchError(this.handleError.bind(this)))
    .subscribe({
      next : (res) => {
        console.log("resresres",res)
      },error : (err) => {
        console.log("erroraxperrr",err)
      }
    })
  }

  


}
