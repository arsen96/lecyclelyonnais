import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { GlobalService, UserRole } from '../services/global.service';
import { filter, take, map, catchError, of } from 'rxjs';


export const routeRedirectionRole = (role:string):string => {
  let redirectionRoute:string;
  if (role === UserRole.CLIENT) {
    redirectionRoute = '/interventions';
  } else if (role === UserRole.ADMIN) {
    redirectionRoute = '/users';
  } else if(role === UserRole.TECHNICIAN){
    redirectionRoute = '/mesinterventions';
  }else{
    redirectionRoute = '/list-zones';
  }

  return redirectionRoute;
}

export const manageAccessGuard: CanActivateFn = (route, state) => {
  const globalService = inject(GlobalService);
  const router = inject(Router);
  
  return globalService.userRole.pipe(
    filter(userRole => userRole !== null),
    take(1),
    map(userRole => {
      const requiredRoles = (route.data as any)?.roles as string[];
      const canAccess = requiredRoles ? requiredRoles.includes(userRole) : true;
      if (!canAccess && userRole) {
        const currentUrl = routeRedirectionRole(userRole);
        console.log("currentUrl",currentUrl)
        router.navigateByUrl(currentUrl);
        return false;
      }
      
      return canAccess;
    }),
    catchError(error => {
      console.error('Guard timeout or error:', error);
      // router.navigateByUrl('/login');
      return of(false);
    })
  );
};


export const isConnected: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const globalService = inject(GlobalService);
  const userRole = globalService.userRole.getValue();
  const canAccess = userRole ? false : true;
  if (!canAccess && userRole) {
    const currentUrl = routeRedirectionRole(userRole);
    router.navigateByUrl(currentUrl);
  }
  return true;
};