import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, concatMap, finalize, of,  tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private globalLoading = new BehaviorSubject<Boolean>(false);
  public $loader = this.globalLoading.asObservable();

  showLoaderUntilCompleted<T>(obs$:Observable<T>) {
    return of(null).pipe(
      tap(() => this.setLoading(true)),
      concatMap(() => obs$),
      finalize(() => this.setLoading(false))
    )
  }

  setLoading(load:boolean){
    this.globalLoading.next(load)
  }

  constructor() { }
}
