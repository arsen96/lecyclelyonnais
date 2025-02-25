import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import {Subject,lastValueFrom,} from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthBaseService } from './auth-base.service';
import { BaseService } from '../base.service';


export interface UserInfo {
  info:{
    sub:string;
    email:string;
    name:string;
    picture:string;
    email_verified:boolean
  }
}


const googleAuthConfig:AuthConfig = {
   issuer: 'https://accounts.google.com',
   redirectUri: window.location.origin + '/login',
   strictDiscoveryDocumentValidation:false,
   clientId: '',
   dummyClientSecret: 'secret',
   scope: 'openid profile email ',
   showDebugInformation: true,
}

@Injectable({
  providedIn: 'root'
})
export class OauthService extends AuthBaseService{

  userProfileSubject = new Subject<UserInfo>();
  public environment:any
  constructor(public oAuthService:OAuthService) {
    super();
    this.environment = environment;
    googleAuthConfig.clientId = this.environment.GOOGLE_CLIENT_ID
    oAuthService.configure(googleAuthConfig);
   }

   public loginOauth(){
    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      this.oAuthService.tryLogin().then(() => {
        if(!this.oAuthService.hasValidAccessToken()){
          this.oAuthService.initLoginFlow();
        }else{
          this.oAuthService.loadUserProfile().then((userProfile) => {
              this.userProfileSubject.next(userProfile as UserInfo);
          })
        }
      })
    })
   }
   // un tehcnicien = un zone

  async loginOauthApi(email:string): Promise<string | null>{
    const oauthValue = { email }
    return await lastValueFrom(super.login(oauthValue,`${BaseService.baseApi}/auth/oauth`));
  }
  
   override logout(){
    console.error("oauthoauthoauthoauth")
    this.oAuthService.logOut();
    super.logout();
    this.globalService.isAuthenticated.next(false)
   }


}


