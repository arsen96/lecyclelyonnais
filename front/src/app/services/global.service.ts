import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import { Technician } from '../models/technicians';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  isAuthenticated = new BehaviorSubject<boolean>(false)
  user = new BehaviorSubject<User | Technician | null>(null)
  userRole = new BehaviorSubject<'client' | 'technician' | null>(null)
  constructor() { }
}
