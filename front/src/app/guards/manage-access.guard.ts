import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { GlobalService, UserRole } from '../services/global.service';


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
  const userRole = globalService.userRole.getValue();
  const requiredRoles = (route.data as any)?.roles as string[];
  const canAccess = requiredRoles ? requiredRoles.includes(userRole) : true;
  

  if (!canAccess && userRole) {
    const currentUrl = routeRedirectionRole(userRole);
    console.log("currentUrlcurrentUrlcurrentUrlcurrentUrl",currentUrl)
    console.log("userRoleuserRoleuserRole",userRole)
    router.navigateByUrl(currentUrl);
  }

  return true;
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