import { Injectable } from '@angular/core';
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
  constructor() { }


  loadAllData(bicycleService:BicycleService,technicianService:TechnicianService,interventionService:InterventionService){
    bicycleService.get().subscribe()
    technicianService.get();  
    interventionService.interventionLoad()
    interventionService.get();
  }
}
