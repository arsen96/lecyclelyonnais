import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { manageAccessGuard, isConnected, routeRedirectionRole } from './manage-access.guard';
import { GlobalService, UserRole } from '../services/global.service';

describe('Guards', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const globalServiceSpy = jasmine.createSpyObj('GlobalService', [], {
      userRole: new BehaviorSubject<string | null>(null)
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: GlobalService, useValue: globalServiceSpy }
      ]
    });

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockGlobalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = {} as RouterStateSnapshot;
  });

  describe('routeRedirectionRole()', () => {
    it('should return /interventions for CLIENT role', () => {
      const result = routeRedirectionRole(UserRole.CLIENT);
      expect(result).toBe('/interventions');
    });

    it('should return /users for ADMIN role', () => {
      const result = routeRedirectionRole(UserRole.ADMIN);
      expect(result).toBe('/users');
    });

    it('should return /mesinterventions for TECHNICIAN role', () => {
      const result = routeRedirectionRole(UserRole.TECHNICIAN);
      expect(result).toBe('/mesinterventions');
    });

    it('should return /list-zones for SUPERADMIN role', () => {
      const result = routeRedirectionRole(UserRole.SUPERADMIN);
      expect(result).toBe('/list-zones');
    });

    it('should return /list-zones for unknown role', () => {
      const result = routeRedirectionRole('unknown-role');
      expect(result).toBe('/list-zones');
    });
  });

  describe('manageAccessGuard', () => {
    it('should return true when no roles are required', () => {
      mockRoute.data = {};
      mockGlobalService.userRole.next(UserRole.CLIENT);

      const result = TestBed.runInInjectionContext(() => 
        manageAccessGuard(mockRoute, mockState)
      );

      expect(result).toBe(true);
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should return true when user has required role', () => {
      mockRoute.data = { roles: [UserRole.ADMIN, UserRole.CLIENT] };
      mockGlobalService.userRole.next(UserRole.CLIENT);

      const result = TestBed.runInInjectionContext(() => 
        manageAccessGuard(mockRoute, mockState)
      );

      expect(result).toBe(true);
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should redirect when user does not have required role', () => {
      mockRoute.data = { roles: [UserRole.ADMIN] };
      mockGlobalService.userRole.next(UserRole.CLIENT);
      spyOn(console, 'log');

      const result = TestBed.runInInjectionContext(() => 
        manageAccessGuard(mockRoute, mockState)
      );

      expect(result).toBe(true);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/interventions');
      expect(console.log).toHaveBeenCalledWith('currentUrlcurrentUrlcurrentUrlcurrentUrl', '/interventions');
      expect(console.log).toHaveBeenCalledWith('userRoleuserRoleuserRole', UserRole.CLIENT);
    });

    it('should not redirect when user has no role', () => {
      mockRoute.data = { roles: [UserRole.ADMIN] };
      mockGlobalService.userRole.next(null);

      const result = TestBed.runInInjectionContext(() => 
        manageAccessGuard(mockRoute, mockState)
      );

      expect(result).toBe(true);
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should redirect TECHNICIAN from ADMIN route', () => {
      mockRoute.data = { roles: [UserRole.ADMIN] };
      mockGlobalService.userRole.next(UserRole.TECHNICIAN);

      const result = TestBed.runInInjectionContext(() => 
        manageAccessGuard(mockRoute, mockState)
      );

      expect(result).toBe(true);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/mesinterventions');
    });

    it('should redirect ADMIN from CLIENT route', () => {
      mockRoute.data = { roles: [UserRole.CLIENT] };
      mockGlobalService.userRole.next(UserRole.ADMIN);

      const result = TestBed.runInInjectionContext(() => 
        manageAccessGuard(mockRoute, mockState)
      );

      expect(result).toBe(true);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/users');
    });
  });

  describe('isConnected', () => {
    it('should return true when user is not connected (null role)', () => {
      mockGlobalService.userRole.next(null);

      const result = TestBed.runInInjectionContext(() => 
        isConnected(mockRoute, mockState)
      );

      expect(result).toBe(true);
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should redirect when user is connected (has role)', () => {
      mockGlobalService.userRole.next(UserRole.CLIENT);

      const result = TestBed.runInInjectionContext(() => 
        isConnected(mockRoute, mockState)
      );

      expect(result).toBe(true);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/interventions');
    });

    it('should redirect ADMIN to correct route when connected', () => {
      mockGlobalService.userRole.next(UserRole.ADMIN);

      const result = TestBed.runInInjectionContext(() => 
        isConnected(mockRoute, mockState)
      );

      expect(result).toBe(true);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/users');
    });

    it('should redirect TECHNICIAN to correct route when connected', () => {
      mockGlobalService.userRole.next(UserRole.TECHNICIAN);

      const result = TestBed.runInInjectionContext(() => 
        isConnected(mockRoute, mockState)
      );

      expect(result).toBe(true);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/mesinterventions');
    });

    it('should redirect SUPERADMIN to correct route when connected', () => {
      mockGlobalService.userRole.next(UserRole.SUPERADMIN);

      const result = TestBed.runInInjectionContext(() => 
        isConnected(mockRoute, mockState)
      );

      expect(result).toBe(true);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/list-zones');
    });
  });
});