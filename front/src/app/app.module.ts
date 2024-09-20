import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {  provideHttpClient, withInterceptors } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import {  tokenInterceptor } from './token-interceptor.interceptor';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [AppComponent,LoaderComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,OAuthModule.forRoot()],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },provideHttpClient(withInterceptors([tokenInterceptor])),
],
  bootstrap: [AppComponent],
})
export class AppModule {}
