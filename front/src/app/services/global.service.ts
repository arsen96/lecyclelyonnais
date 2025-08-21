import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import { Technician } from '../models/technicians';
import { InterventionService } from './intervention.service';
import { TechnicianService } from './technician.service';
import { BicycleService } from './bicycle.service';

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  CLIENT = 'client',
  TECHNICIAN = 'technician',
}

@Injectable({
  providedIn: 'root'
})

export class GlobalService {

  isAuthenticated = new BehaviorSubject<boolean>(false)
  user = new BehaviorSubject<User | Technician | null>(null)
  userRole = new BehaviorSubject<'client' | 'technician' | 'admin' | 'superadmin' | null>(null)
  isMobile: boolean = false;
  isTablet: boolean = false;
  isDesktop: boolean = false;
  isLandscape: boolean = false;
  isPortrait: boolean = false;

  constructor(private platform: Platform) {
    this.initializePlatformDetection();
  }

  private initializePlatformDetection() {
    this.updatePlatformDetection();
    
    this.platform.resize.subscribe(() => {
      this.updatePlatformDetection();
    });
  }

  private updatePlatformDetection() {
    this.isMobile = this.platform.is('mobile');
    this.isTablet = this.platform.is('tablet');
    this.isDesktop = this.platform.is('desktop');
    this.isLandscape = window.matchMedia('(orientation: landscape)').matches;
    this.isPortrait = window.matchMedia('(orientation: portrait)').matches;
    this.setHTMLClass();
  }

  setHTMLClass(){

    if(this.isLandscape){
      document.documentElement.classList.add('is-landscape');
    }
    if(this.isPortrait){
      document.documentElement.classList.add('is-portrait');
    }
    if(this.isMobile){
      document.documentElement.classList.add('is-mobile');
    }
    if(this.isTablet){
      document.documentElement.classList.add('is-tablet');
    }
    if(this.isDesktop){
      document.documentElement.classList.add('is-desktop');
    }
  }


  /**
   * Charge toutes les données nécessaires pour l'application
   * @param bicycleService - Service de gestion des vélos
   * @param technicianService - Service de gestion des techniciens
   * @param interventionService - Service de gestion des interventions
   */
  loadAllData(bicycleService:BicycleService,technicianService:TechnicianService,interventionService:InterventionService){
    bicycleService.get().subscribe()
    technicianService.get();  
    interventionService.interventionLoad()
    interventionService.get();
  }
}
