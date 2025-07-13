import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, shareReplay, Subject, tap, lastValueFrom } from 'rxjs';
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
export class AuthBaseService {

  tokenObs: Observable<string> | null;
  router = inject(Router);
  public http = inject(HttpClient)
  public globalService = inject(GlobalService)
  public loadingService = inject(LoadingService)
  private isUserLoadedSubject = new BehaviorSubject<boolean>(false);
  isUserLoaded$ = this.isUserLoadedSubject.asObservable();
  private wasAuthenticated = false;
  private initialized = false;

  constructor() {
    this.wasAuthenticated = !!this.checkIsAuthenicated();
    this.globalService.isAuthenticated.next(this.wasAuthenticated);
    
    if (!this.wasAuthenticated) {
      localStorage.removeItem("access_token");
    }

    this.unauthenticated();
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      if (this.wasAuthenticated) {
        await this.getUser();
      }
      this.initialized = true;
    } catch (error) {
      console.error('Error during auth service initialization:', error);
      this.initialized = true;
    }
  }

  async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  getToken(): string | null {
    const token = localStorage.getItem('authToken');
    return token;
  }

  setSession(token: string) {
    localStorage.setItem("access_token", token);
  }

  public checkIsAuthenicated() {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const now = Date.now() / 1000;
        const tokenValid = typeof decodedToken.exp !== 'undefined' && decodedToken.exp > now;
        
        if (!tokenValid) {
          this.globalService.user.next(null);
          this.globalService.userRole.next(null);
        }
        return tokenValid;
      } catch (error) {
        console.error('Error decoding token:', error);
        this.globalService.user.next(null);
        this.globalService.userRole.next(null);
        return false;
      }
    }
    
    this.globalService.user.next(null);
    this.globalService.userRole.next(null);
    return false;
  }

  login(loginCredentials: any, endpoint: string): Observable<string> {
    if (!this.tokenObs) {
      this.tokenObs = this.http.post<BearerToken>(endpoint, loginCredentials)
        .pipe(catchError(BaseService.handleError.bind(this)))
        .pipe(
          tap(res => {
            if (res) {
              this.setSession(res.token);
              this.isUserLoadedSubject.next(true);
              // ✅ Initialiser après login réussi
              this.getUser().catch(error => {
                console.error('Error loading user after login:', error);
              });
            }
          }),
          map(data => {
            return data;
          }),
          shareReplay()
        );
    }
    return this.tokenObs;
  }

  async getUser(): Promise<any> {
    try {
      const response = await lastValueFrom(this.http.get(`${BaseService.baseApi}/auth/user`)
        .pipe(catchError(BaseService.handleError.bind(this)))
      );
      
      this.globalService.user.next(response.data);
      this.globalService.userRole.next(response.data.role);
      this.isUserLoadedSubject.next(true);
      return response.data;
    } catch (error) {
      console.error('Error loading user:', error);
      this.isUserLoadedSubject.next(true);
      throw error;
    }
  }

  decodeJWT(token: string) {
    try {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  logout() {
    this.tokenObs = null;
    this.initialized = false; // ✅ Reset de l'initialisation
    const role = this.globalService.userRole.getValue();
    localStorage.removeItem("access_token");
    
    if (role === 'admin' || role === 'superadmin') {
      this.router.navigateByUrl("login-admin");
    } else {
      this.router.navigateByUrl("login");
    }
    
    this.globalService.user.next(null);
    this.globalService.userRole.next(null);
    this.loadingService.setLoading(false);
  }

  public unauthenticated(force = false): void {
    BaseService.$disconnect.subscribe((result) => {
      if (result) {
        if (this.wasAuthenticated || force) {
          this.logout();
          this.router.navigateByUrl("login");
        }
      }
    });
  }
}