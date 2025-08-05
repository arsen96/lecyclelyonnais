import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { AdminsPage } from './admins.page';
import { AdminService } from 'src/app/services/admin.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MessageService, Message } from 'src/app/services/message.service';
import { CompanyService } from 'src/app/services/company.service';
import { GlobalService, UserRole } from 'src/app/services/global.service';

import { 
  AdminFactory, 
  CompanyFactory,
  createServiceSpy,
  createLoadingServiceSpy,
  createMessageServiceSpy,
  createRouterSpy,
  createActivatedRouteSpy,
  TEST_CONSTANTS
} from '../../../test-fixtures';

describe('AdminsPage', () => {
  let component: AdminsPage;
  let fixture: ComponentFixture<AdminsPage>;
  let mockAdminService: jasmine.SpyObj<AdminService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockCompanyService: jasmine.SpyObj<CompanyService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockGlobalService: any;

  const mockAdmin = AdminFactory.create();
  const mockCompanies = CompanyFactory.createMultiple(2);

  beforeEach(() => {
    mockAdminService = createServiceSpy('AdminService', []) as jasmine.SpyObj<AdminService>;
    mockLoadingService = createLoadingServiceSpy();
    mockMessageService = createMessageServiceSpy();
    mockCompanyService = createServiceSpy('CompanyService', ['get']) as jasmine.SpyObj<CompanyService>;
    mockRouter = createRouterSpy();
    mockActivatedRoute = createActivatedRouteSpy();
    mockGlobalService = { userRole: new BehaviorSubject(UserRole.SUPERADMIN) };

    Object.defineProperty(mockAdminService, 'allAdmins', {
      value: [mockAdmin],
      writable: true
    });
    
    mockCompanyService.get.and.returnValue(Promise.resolve(mockCompanies));

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AdminsPage],
      providers: [
        FormBuilder,
        { provide: AdminService, useValue: mockAdminService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: GlobalService, useValue: mockGlobalService }
      ]
    });

    fixture = TestBed.createComponent(AdminsPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('should initialize form with validators', () => {
      component.ngOnInit();

      expect(component.adminForm).toBeDefined();
      expect(component.adminForm.get('first_name')).toBeDefined();
      expect(component.adminForm.get('email')).toBeDefined();
      expect(component.adminForm.get('password')).toBeDefined();
      expect(component.adminForm.get('company_id')).toBeDefined();
    });

    it('should load admin details when adminId exists', () => {
      mockActivatedRoute.paramMap = of(new Map([['id', '2']]));
      spyOn(component, 'loadAdminDetails');

      component.ngOnInit();

      expect(component.loadAdminDetails).toHaveBeenCalledWith(2);
    });

    it('should load companies on init', async () => {
      spyOn(component, 'loadCompanies');

      component.ngOnInit();

      expect(component.loadCompanies).toHaveBeenCalled();
    });
  });

  describe('Admin operations', () => {
    beforeEach(() => {
      component.ngOnInit();
      const formData = AdminFactory.create({
        first_name: 'Test',
        last_name: 'Admin',
        email: 'test@example.com',
        password: 'password123',
        company_id: 1
      });
      component.adminForm.patchValue(formData);
    });

    it('should update existing admin', () => {
      component.selectedAdmin = AdminFactory.create();
      spyOn(component, 'updateAdmin');

      component.onSubmitAdmin();

      expect(component.updateAdmin).toHaveBeenCalled();
    });

    it('should create new admin and navigate', () => {
      component.selectedAdmin = null;
      const createResponse = { success: true };
      mockAdminService.create.and.returnValue(of(createResponse as any));
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(createResponse));

      component.onSubmitAdmin();

      expect(mockAdminService.create).toHaveBeenCalledWith(component.adminForm.value);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('admins-list');
    });

    it('should handle create errors', () => {
      component.selectedAdmin = null;
      const error = 'Create failed';
      mockAdminService.create.and.returnValue(throwError(() => error));
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(throwError(() => error));
      spyOn(component, 'displayError');

      component.onSubmitAdmin();

      expect(component.displayError).toHaveBeenCalledWith(error);
    });

    it('should validate form before submit', () => {
      component.adminForm.patchValue({ first_name: '', email: '' });

      component.onSubmitAdmin();

      expect(mockMessageService.showMessage).toHaveBeenCalledWith(
        TEST_CONSTANTS.MESSAGES.FORM_INVALID,
        Message.danger
      );
    });
  });

  describe('Admin details loading', () => {
    it('should load and patch admin data', async () => {
      const testAdmin = AdminFactory.create({ id: 1 });
      mockAdminService.get.and.returnValue(Promise.resolve([testAdmin]));
      component.ngOnInit();

      await component.loadAdminDetails(1);

      expect(component.selectedAdmin).toEqual(testAdmin);
      expect(component.adminForm.get('first_name')?.value).toBe(testAdmin.first_name);
      expect(component.resetPasswordMode).toBe(false);
    });

    it('should clear validators for existing admin', async () => {
      const existingAdmin = AdminFactory.create({ id: 1 });
      mockAdminService.get.and.returnValue(Promise.resolve([existingAdmin]));
      component.ngOnInit();
      spyOn(component.adminForm.get('password')!, 'clearValidators');
      spyOn(component.adminForm.get('company_id')!, 'clearValidators');

      await component.loadAdminDetails(1);

      expect(component.adminForm.get('password')!.clearValidators).toHaveBeenCalled();
      expect(component.adminForm.get('company_id')!.clearValidators).toHaveBeenCalled();
    });
  });

  describe('Password features', () => {
    beforeEach(() => component.ngOnInit());

    it('should generate password and show it', () => {
      component.generatePassword();

      const password = component.adminForm.get('password')?.value;
      expect(password).toBeDefined();
      expect(password.length).toBe(8);
      expect(component.showPassword).toBe(true);
    });

    it('should enable password reset mode', () => {
      component.enablePasswordReset();

      expect(component.resetPasswordMode).toBe(true);
      expect(component.adminForm.get('password')?.value).toBe('');
    });
  });

  describe('Company operations', () => {
    it('should load companies successfully', async () => {
      const testCompanies = CompanyFactory.createMultiple(3);
      mockCompanyService.get.and.returnValue(Promise.resolve(testCompanies));

      await component.loadCompanies();

      expect(component.companies).toEqual(testCompanies);
    });
  });


  // Tests avec factories avancées
  describe('Factory usage examples', () => {
    it('should work with super admin', () => {
      const superAdmin = AdminFactory.superAdmin();
      component.selectedAdmin = superAdmin;
      
      expect(superAdmin.role).toBe('superadmin');
    });

    it('should work with admin for specific company', () => {
      const company = CompanyFactory.create({ id: 5 });
      const adminForCompany = AdminFactory.withCompany(company.id);
      
      expect(adminForCompany.company_id).toBe(5);
    });

    it('should maintain form structure after admin creation', () => {
      const newAdmin = AdminFactory.create({
        first_name: 'Regression',
        last_name: 'Test',
        email: 'regression@test.com'
      });
      
      component.ngOnInit();
      component.adminForm.patchValue(newAdmin);
      
      expect(component.adminForm.get('first_name')?.value).toBe('Regression');
      expect(component.adminForm.get('email')?.value).toBe('regression@test.com');
      expect(component.adminForm.valid).toBeTruthy();
    });
  });
});