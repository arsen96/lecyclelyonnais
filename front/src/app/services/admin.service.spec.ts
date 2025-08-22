import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { CompanyService } from './company.service';
import { GlobalService } from './global.service';
import { AuthBaseService } from './auth/auth-base.service';
import { BaseService } from './base.service';
import { BehaviorSubject } from 'rxjs';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;
  let mockGlobalService: any;

  const mockAdmins = [
    { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@test.com', role: 'admin', company_id: 1 },
    { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane@test.com', role: 'superadmin', company_id: 1 }
  ];

  beforeEach(() => {
    const companyServiceSpy = jasmine.createSpyObj('CompanyService', [], {
      subdomainREQ: { domain: 'test' }
    });
    const authServiceSpy = jasmine.createSpyObj('AuthBaseService', ['setSession']);
    
    mockGlobalService = {
      user: new BehaviorSubject({ id: 3 }),
      userRole: new BehaviorSubject('admin'),
      isAuthenticated: new BehaviorSubject(false)
    };

    TestBed.configureTestingModule({
      providers: [
        AdminService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CompanyService, useValue: companyServiceSpy },
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: AuthBaseService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    it('should return cached admins without HTTP call', async () => {
      service.allAdmins = [...mockAdmins] as any;

      const result = await service.get();

      expect(result).toEqual(mockAdmins as any);
      httpMock.expectNone(`${BaseService.baseApi}/admins/get`);
    });

    it('should fetch from API when cache empty', async () => {
      const resultPromise = service.get();

      const req = httpMock.expectOne(`${BaseService.baseApi}/admins/get`);
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, data: mockAdmins });

      const result = await resultPromise;
      expect(result).toEqual(mockAdmins as any);
    });

    it('should filter out current user from results', async () => {
      const adminsWithCurrentUser = [...mockAdmins, { id: 3, first_name: 'Current', last_name: 'User' }];
      
      const resultPromise = service.get();

      const req = httpMock.expectOne(`${BaseService.baseApi}/admins/get`);
      req.flush({ success: true, data: adminsWithCurrentUser });

      await resultPromise;
      expect(service.allAdmins.some(admin => admin.id === 3)).toBe(false);
    });
  });

  describe('create()', () => {
    it('should POST to create endpoint with domain', (done) => {
      const newAdmin = { first_name: 'New', last_name: 'Admin', email: 'new@test.com' };

      service.create(newAdmin as any).subscribe(() => done());

      const req = httpMock.expectOne(`${BaseService.baseApi}/admins/create`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ ...newAdmin, domain: 'test' });
      req.flush({});
    });
  });

  describe('update()', () => {
    it('should POST to update endpoint', (done) => {
      const updatedAdmin = { id: 1, first_name: 'Updated', last_name: 'Admin' };

      service.update(updatedAdmin as any).subscribe(() => done());

      const req = httpMock.expectOne(`${BaseService.baseApi}/admins/update`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(updatedAdmin);
      req.flush({});
    });
  });

  describe('delete()', () => {
    it('should POST to delete endpoint', (done) => {
      const idsToDelete = [1, 2];

      service.delete(idsToDelete).subscribe(() => done());

      const req = httpMock.expectOne(`${BaseService.baseApi}/admins/delete`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual({ ids: idsToDelete });
      req.flush({});
    });
  });

  describe('login()', () => {
    it('should authenticate admin and set session', (done) => {
      const credentials = { email: 'admin@test.com', password: 'password' };
      const loginResponse = {
        token: 'fake-token',
        data: { user: { id: 1, role: 'admin', first_name: 'Admin' } }
      };

      service.login(credentials.email, credentials.password).subscribe(user => {
        expect(user).toEqual(loginResponse.data.user as any);
        expect(mockGlobalService.isAuthenticated.getValue()).toBe(true);
        expect(mockGlobalService.user.getValue()).toEqual(loginResponse.data.user);
        expect(mockGlobalService.userRole.getValue()).toBe('admin');
        done();
      });

      const req = httpMock.expectOne(`${BaseService.baseApi}/admins/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ ...credentials, domain: 'test' });
      req.flush(loginResponse);
    });
  });
});