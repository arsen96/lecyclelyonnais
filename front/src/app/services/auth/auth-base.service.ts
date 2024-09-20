import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, shareReplay, Subject, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { jwtDecode } from "jwt-decode";
import { GlobalService } from '../global.service';

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
  // isAuthenticated = new BehaviorSubject<boolean>(false)
  constructor(){
    super();
    this.globalService.isAuthenticated.next(!!localStorage.getItem("access_token"));
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
      return tokenValid
    }
    return false;
  }

  login(loginCredentials:any,endpoint:string): Observable<string> {
    if(!this.tokenObs){
      this.tokenObs =  this.http.post<BearerToken>(endpoint,loginCredentials)
      .pipe(catchError(this.handleError.bind(this)))
      .pipe(
        tap(res => {
          if (res) {
            this.setSession(res.token);
          } 
        }),
        map(data => {
          return data.token
        }),
        shareReplay()
      );
    }
    return this.tokenObs;
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
    localStorage.removeItem("access_token");
    this.router.navigateByUrl("login")
  }


  public override unauthenticated(): void {
      this.logout();
  }

  test(){
    this.http.get(`${this.postApi}/auth/test`)
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
