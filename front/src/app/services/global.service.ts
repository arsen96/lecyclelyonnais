import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  isAuthenticated = new BehaviorSubject<boolean>(false)
  user = new BehaviorSubject<User | null>(null) 
  constructor() { }
}
