import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  isAuthenticated = new BehaviorSubject<boolean>(false)
  constructor() { }
}
