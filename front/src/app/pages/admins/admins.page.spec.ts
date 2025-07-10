import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AdminsPage } from './admins.page';
import { AdminService } from 'src/app/services/admin.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MessageService, Message } from 'src/app/services/message.service';
import { CompanyService } from 'src/app/services/company.service';
import { GlobalService, UserRole } from 'src/app/services/global.service';
import { BehaviorSubject } from 'rxjs';

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

  const mockAdmin = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'admin' as const,
    company_id: 1
  };

  const mockCompanies = [
    { 
      id: 1, 
      name: 'Company A',
      email: 'contact@company-a.com',
      subdomain: 'company-a',
      theme_color: '#ff0000',
      phone: '0123456789'
    },
    { 
      id: 2, 
      name: 'Company B',
      email: 'contact@company-b.com', 
      subdomain: 'company-b',
      theme_color: '#00ff00',
      phone: '0987654321'
    }
  ];

  beforeEach(() => {
    const adminServiceSpy = jasmine.createSpyObj('AdminService', ['get', 'create', 'update'], {
      allAdmins: [mockAdmin]
    });
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['showLoaderUntilCompleted']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['showToast', 'showMessage', 'clearMessage']);
    const companyServiceSpy = jasmine.createSpyObj('CompanyService', ['get']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    
    // Setup default return values
    companyServiceSpy.get.and.returnValue(Promise.resolve(mockCompanies));

    mockActivatedRoute = {
      paramMap: of(new Map([['id', null]]))
    };

    mockGlobalService = {
      userRole: new BehaviorSubject(UserRole.SUPERADMIN)
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AdminsPage],
      providers: [
        FormBuilder,
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: CompanyService, useValue: companyServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: GlobalService, useValue: mockGlobalService }
      ]
    });

    fixture = TestBed.createComponent(AdminsPage);
    component = fixture.componentInstance;
    
    mockAdminService = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    mockLoadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    mockCompanyService = TestBed.inject(CompanyService) as jasmine.SpyObj<CompanyService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should initialize form with validators', () => {
      component.ngOnInit();

      expect(component.adminForm).toBeDefined();
      expect(component.adminForm.get('first_name')).toBeDefined();
      expect(component.adminForm.get('email')).toBeDefined();
      expect(component.adminForm.get('password')).toBeDefined();
      expect(component.adminForm.get('company_id')).toBeDefined();
    });

    it('should load admin details when adminId exists', () => {
      mockActivatedRoute.paramMap = of(new Map([['id', '1']]));
      spyOn(component, 'loadAdminDetails');

      component.ngOnInit();

      expect(component.loadAdminDetails).toHaveBeenCalledWith(1);
    });

    it('should load companies', async () => {
      spyOn(component, 'loadCompanies');

      component.ngOnInit();

      expect(component.loadCompanies).toHaveBeenCalled();
    });
  });

  describe('loadAdminDetails()', () => {
    it('should load and patch admin data', async () => {
      mockAdminService.get.and.returnValue(Promise.resolve([mockAdmin]));
      component.ngOnInit();

      await component.loadAdminDetails(1);

      expect(component.selectedAdmin).toEqual(mockAdmin);
      expect(component.adminForm.get('first_name')?.value).toBe(mockAdmin.first_name);
      expect(component.resetPasswordMode).toBe(false);
    });

    it('should clear password and company validators for existing admin', async () => {
      mockAdminService.get.and.returnValue(Promise.resolve([mockAdmin]));
      component.ngOnInit();
      spyOn(component.adminForm.get('password')!, 'clearValidators');
      spyOn(component.adminForm.get('company_id')!, 'clearValidators');

      await component.loadAdminDetails(1);

      expect(component.adminForm.get('password')!.clearValidators).toHaveBeenCalled();
      expect(component.adminForm.get('company_id')!.clearValidators).toHaveBeenCalled();
    });
  });

  describe('generatePassword()', () => {
    it('should generate password and show it', () => {
      component.ngOnInit();

      component.generatePassword();

      const password = component.adminForm.get('password')?.value;
      expect(password).toBeDefined();
      expect(password.length).toBe(8);
      expect(component.showPassword).toBe(true);
    });
  });

  describe('enablePasswordReset()', () => {
    it('should enable password reset mode', () => {
      component.ngOnInit();

      component.enablePasswordReset();

      expect(component.resetPasswordMode).toBe(true);
      expect(component.adminForm.get('password')?.value).toBe('');
    });
  });


  describe('onSubmitAdmin()', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.adminForm.patchValue({
        first_name: 'Test',
        last_name: 'Admin',
        email: 'test@example.com',
        password: 'password123',
        company_id: 1
      });
    });

    it('should call updateAdmin when selectedAdmin exists', () => {
      component.selectedAdmin = mockAdmin;
      spyOn(component, 'updateAdmin');

      component.onSubmitAdmin();

      expect(component.updateAdmin).toHaveBeenCalled();
    });

    it('should create new admin when no selectedAdmin', () => {
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

    it('should show error when form is invalid', () => {
      component.adminForm.patchValue({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        company_id: ''
      });

      component.onSubmitAdmin();

      expect(mockMessageService.showMessage).toHaveBeenCalledWith(
        'Veuillez remplir tous les champs requis.',
        Message.danger
      );
    });
  });

  describe('loadCompanies()', () => {
    it('should load companies successfully', async () => {
      mockCompanyService.get.and.returnValue(Promise.resolve(mockCompanies));

      await component.loadCompanies();

      expect(component.companies).toEqual(mockCompanies);
    });

  });

  describe('displayError()', () => {
    it('should display error message', () => {
      const errorMessage = 'Test error';

      component.displayError(errorMessage);

      expect(mockMessageService.showMessage).toHaveBeenCalledWith(errorMessage, Message.danger);
    });
  });

  describe('ionViewWillLeave()', () => {
    it('should clear messages', () => {
      component.ionViewWillLeave();

      expect(mockMessageService.clearMessage).toHaveBeenCalled();
    });
  });
});