import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginAdminPage } from './login-admin.page';
import { AdminService } from 'src/app/services/admin.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MessageService, Message } from 'src/app/services/message.service';
import { GlobalService } from 'src/app/services/global.service';
import { BicycleService } from 'src/app/services/bicycle.service';
import { TechnicianService } from 'src/app/services/technician.service';
import { InterventionService } from 'src/app/services/intervention.service';

describe('LoginAdminPage', () => {
  let component: LoginAdminPage;
  let fixture: ComponentFixture<LoginAdminPage>;
  let mockAdminService: jasmine.SpyObj<AdminService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockGlobalService: jasmine.SpyObj<GlobalService>;

  beforeEach(() => {
    const adminServiceSpy = jasmine.createSpyObj('AdminService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['showLoaderUntilCompleted']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['clearMessage', 'showMessage']);
    const globalServiceSpy = jasmine.createSpyObj('GlobalService', ['loadAllData']);
    const bicycleServiceSpy = jasmine.createSpyObj('BicycleService', ['get']);
    const technicianServiceSpy = jasmine.createSpyObj('TechnicianService', ['get']);
    const interventionServiceSpy = jasmine.createSpyObj('InterventionService', ['get']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginAdminPage],
      providers: [
        FormBuilder,
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: BicycleService, useValue: bicycleServiceSpy },
        { provide: TechnicianService, useValue: technicianServiceSpy },
        { provide: InterventionService, useValue: interventionServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(LoginAdminPage);
    component = fixture.componentInstance;
    
    mockAdminService = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockLoadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    mockGlobalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should initialize form with email and password validators', () => {
      component.ngOnInit();

      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.get('email')).toBeDefined();
      expect(component.loginForm.get('password')).toBeDefined();
      
      // Test required validators
      component.loginForm.patchValue({ email: '', password: '' });
      expect(component.loginForm.invalid).toBe(true);
    });

    it('should require valid email format', () => {
      component.ngOnInit();
      const emailControl = component.loginForm.get('email');

      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.hasError('email')).toBe(false);
    });
  });

  describe('onSubmit()', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.loginForm.patchValue({
        email: 'admin@test.com',
        password: 'password123'
      });
    });

    it('should call admin login service on valid form', () => {
      const mockResponse = { user: { id: 1, email: 'admin@test.com' } } as any;
      mockAdminService.login.and.returnValue(of(mockResponse));
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(mockResponse));

      component.onSubmit();

      expect(component.formSubmitted).toBe(true);
      expect(mockAdminService.login).toHaveBeenCalledWith('admin@test.com', 'password123');
      expect(mockLoadingService.showLoaderUntilCompleted).toHaveBeenCalled();
    });

    it('should navigate to admins-list on successful login', () => {
      const mockResponse = { user: { id: 1, email: 'admin@test.com' } } as any;
      mockAdminService.login.and.returnValue(of(mockResponse));
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(mockResponse));

      component.onSubmit();

      expect(mockMessageService.clearMessage).toHaveBeenCalled();
      expect(mockGlobalService.loadAllData).toHaveBeenCalled();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('admins-list');
    });

    it('should handle login errors', () => {
      const mockError = { error: { message: 'Invalid credentials' } };
      mockAdminService.login.and.returnValue(throwError(() => mockError));
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(throwError(() => mockError));
      spyOn(console, 'error');

      component.onSubmit();

      expect(mockMessageService.showMessage).toHaveBeenCalledWith('Invalid credentials', Message.danger);
      expect(component.displayMsg).toBe(true);
      expect(console.error).toHaveBeenCalledWith('Login failed:', mockError);
    });

    it('should show validation message when form is invalid', () => {
      component.loginForm.patchValue({ email: '', password: '' });

      component.onSubmit();

      expect(mockMessageService.showMessage).toHaveBeenCalledWith(
        'Veuillez remplir tous les champs requis.',
        Message.danger
      );
      expect(component.displayMsg).toBe(true);
      expect(mockAdminService.login).not.toHaveBeenCalled();
    });

  });

  describe('Component initialization', () => {
    it('should initialize displayMsg to false', () => {
      expect(component.displayMsg).toBe(false);
    });

    it('should initialize formSubmitted to false', () => {
      expect(component.formSubmitted).toBe(false);
    });

    it('should inject services correctly', () => {
      expect(component.messageService).toBeDefined();
      expect(component.adminService).toBeDefined();
      expect(component.router).toBeDefined();
      expect(component.loaderService).toBeDefined();
      expect(component.globalService).toBeDefined();
    });
  });
});