import { Observable } from 'rxjs';
import { PlanningModel } from './planningModel';

export interface CRUD<T> {
  create(...args: any[]):Promise<any> | Observable<any>;
  get(...args: any[]): Promise<any> | Observable<any>;
  update(...args: any[]): Promise<T> | Observable<T>;
  delete(...args: any[]): Promise<void> | Observable<void>;
}