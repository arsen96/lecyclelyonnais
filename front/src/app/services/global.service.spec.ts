import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { GlobalService, UserRole } from './global.service';
import { BicycleService } from './bicycle.service';
import { TechnicianService } from './technician.service';
import { InterventionService } from './intervention.service';
import { of } from 'rxjs';

describe('GlobalService', () => {
  let service: GlobalService;
  let mockBicycleService: jasmine.SpyObj<BicycleService>;
  let mockTechnicianService: jasmine.SpyObj<TechnicianService>;
  let mockInterventionService: jasmine.SpyObj<InterventionService>;

  beforeEach(() => {
    const bicycleServiceSpy = jasmine.createSpyObj('BicycleService', ['get']);
    const technicianServiceSpy = jasmine.createSpyObj('TechnicianService', ['get']);
    const interventionServiceSpy = jasmine.createSpyObj('InterventionService', ['interventionLoad', 'get']);

    TestBed.configureTestingModule({
      providers: [
        GlobalService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BicycleService, useValue: bicycleServiceSpy },
        { provide: TechnicianService, useValue: technicianServiceSpy },
        { provide: InterventionService, useValue: interventionServiceSpy }
      ]
    });

    service = TestBed.inject(GlobalService);
    mockBicycleService = TestBed.inject(BicycleService) as jasmine.SpyObj<BicycleService>;
    mockTechnicianService = TestBed.inject(TechnicianService) as jasmine.SpyObj<TechnicianService>;
    mockInterventionService = TestBed.inject(InterventionService) as jasmine.SpyObj<InterventionService>;

    // Setup mocks
    mockBicycleService.get.and.returnValue(of([] as any));
    mockTechnicianService.get.and.returnValue(Promise.resolve([]));
    mockInterventionService.get.and.returnValue(Promise.resolve([]));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('BehaviorSubjects', () => {
    it('should initialize with default values', () => {
      expect(service.isAuthenticated.getValue()).toBe(false);
      expect(service.user.getValue()).toBe(null);
      expect(service.userRole.getValue()).toBe(null);
    });

    it('should update authentication state', () => {
      service.isAuthenticated.next(true);
      expect(service.isAuthenticated.getValue()).toBe(true);
    });

    it('should update user data', () => {
      const mockUser = { id: 1, first_name: 'John', last_name: 'Doe' };
      service.user.next(mockUser as any);
      expect(service.user.getValue()).toEqual(mockUser as any);
    });

    it('should update user role', () => {
      service.userRole.next(UserRole.ADMIN);
      expect(service.userRole.getValue()).toBe(UserRole.ADMIN);
    });
  });

  describe('loadAllData()', () => {
    it('should call all service load methods', () => {
      service.loadAllData(mockBicycleService, mockTechnicianService, mockInterventionService);

      expect(mockBicycleService.get).toHaveBeenCalled();
      expect(mockTechnicianService.get).toHaveBeenCalled();
      expect(mockInterventionService.interventionLoad).toHaveBeenCalled();
      expect(mockInterventionService.get).toHaveBeenCalled();
    });
  });

  describe('UserRole enum', () => {
    it('should have all role types', () => {
      expect(UserRole.SUPERADMIN).toBe('superadmin');
      expect(UserRole.ADMIN).toBe('admin');
      expect(UserRole.CLIENT).toBe('client');
      expect(UserRole.TECHNICIAN).toBe('technician');
    });
  });
});