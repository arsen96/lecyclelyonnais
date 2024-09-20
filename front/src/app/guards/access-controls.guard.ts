import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { GlobalService } from '../services/global.service';

  export const AuthGuard = () => {
    const globalService = inject(GlobalService);
    const router = inject(Router);
    if (globalService.isAuthenticated.getValue() === true) {
      // Token expiré
      router.navigate(['/home']);
      return false;
  }

  return true;
}

