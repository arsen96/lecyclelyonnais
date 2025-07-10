import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { LoginPage } from './login.page';
import { StandardAuth } from 'src/app/services/auth/standard.service';
import { OauthService } from 'src/app/services/auth/oauth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MessageService, Message } from 'src/app/services/message.service';
import { GlobalService } from 'src/app/services/global.service';
import { CompanyService } from 'src/app/services/company.service';
import { BicycleService } from 'src/app/services/bicycle.service';
import { TechnicianService } from 'src/app/services/technician.service';
import { InterventionService } from 'src/app/services/intervention.service';
import { BehaviorSubject } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let mockStandardAuth: jasmine.SpyObj<StandardAuth>;
  let mockOauthService: jasmine.SpyObj<OauthService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockGlobalService: any;
  let mockBicycleService: any;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const standardAuthSpy = jasmine.createSpyObj('StandardAuth', ['loginStandard', 'register']);
    const oauthServiceSpy = jasmine.createSpyObj('OauthService', ['decodeJWT', 'loginOauthApi', 'loginOauth'], {
      oAuthService: { logOut: jasmine.createSpy() }
    });
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['showLoaderUntilCompleted', 'setLoading']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['showMessage', 'clearMessage']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const companyServiceSpy = jasmine.createSpyObj('CompanyService', [], {
      subdomainREQ: { domain: 'test' }
    });
    const bicycleServiceSpy = jasmine.createSpyObj('BicycleService', [], {
      userBicycles: []
    });

    mockGlobalService = {
      isAuthenticated: new BehaviorSubject(false),
      user: new BehaviorSubject(null),
      userRole: new BehaviorSubject(null),
      loadAllData: jasmine.createSpy('loadAllData')
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      declarations: [LoginPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FormBuilder,
        { provide: StandardAuth, useValue: standardAuthSpy },
        { provide: OauthService, useValue: oauthServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: CompanyService, useValue: companyServiceSpy },
        { provide: BicycleService, useValue: bicycleServiceSpy },
        { provide: TechnicianService, useValue: {} },
        { provide: InterventionService, useValue: {} },
        { provide: ActivatedRoute, useValue: { fragment: of(null) } }
      ]
    });

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    
    mockStandardAuth = TestBed.inject(StandardAuth) as jasmine.SpyObj<StandardAuth>;
    mockOauthService = TestBed.inject(OauthService) as jasmine.SpyObj<OauthService>;
    mockLoadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockBicycleService = TestBed.inject(BicycleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('should initialize registration form with validators', () => {
      expect(component.registrationForm).toBeDefined();
      expect(component.registrationForm.get('firstName')).toBeDefined();
      expect(component.registrationForm.get('email')).toBeDefined();
      expect(component.registrationForm.get('password')).toBeDefined();
    });

    it('should validate required fields', () => {
      const form = component.registrationForm;
      
      expect(form.valid).toBeFalse();
      
      form.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        password: 'password123',
        phone: '0123456789'
      });
      
      expect(form.valid).toBeTrue();
    });
  });

  describe('onSubmitLogin()', () => {
    beforeEach(() => {
      component.modelLogin = { email: 'test@test.com', password: 'password' };
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of('success'));
    });

    it('should login and navigate when not in stepper mode', async () => {
      component.isStepper = false;
      mockStandardAuth.loginStandard.and.returnValue(of('token'));

      await component.onSubmitLogin();

      const dataForm = {
        email: 'test@test.com',
        password: 'password',
        domain: 'test'
      }
      expect(mockStandardAuth.loginStandard).toHaveBeenCalledWith(dataForm);
      expect(mockGlobalService.loadAllData).toHaveBeenCalled();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('list-zones');
    });

    it('should emit event when in stepper mode', async () => {
      component.isStepper = true;
      spyOn(component.stepperAuthentication, 'emit');
      mockStandardAuth.loginStandard.and.returnValue(of('token'));

      await component.onSubmitLogin();

      expect(component.stepperAuthentication.emit).toHaveBeenCalledWith(true);
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should handle login errors', async () => {
      const error = 'Login failed';
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(throwError(() => error));
      spyOn(component, 'displayError');

      await component.onSubmitLogin();

      expect(component.displayError).toHaveBeenCalledWith(error, 'login');
    });
  });


  describe('OAuth functionality', () => {
    it('should call OAuth login', () => {
      component.onGoogleLogin();

      expect(mockOauthService.loginOauth).toHaveBeenCalled();
    });
  });

  describe('handleAddressChange()', () => {
    it('should update address and set validation when place has geometry', () => {
      const mockPlace = {
        geometry: { location: {} },
        formatted_address: '123 Test Street'
      };

      component.handleAddressChange(mockPlace);

      expect(component.registrationForm.get('address')?.value).toBe('123 Test Street');
      expect(component.addressValidated).toBeTrue();
    });

    it('should not update when place has no geometry', () => {
      const mockPlace = { formatted_address: '123 Test Street' };

      component.handleAddressChange(mockPlace);

      expect(component.addressValidated).toBeFalse();
    });
  });

  describe('displayError()', () => {
    it('should set error type and show message', () => {
      component.displayError('Test error', 'login');

      expect(component.error.type).toBe('login');
      expect(mockMessageService.showMessage).toHaveBeenCalledWith('Test error', Message.danger);
    });
  });

  describe('ionViewWillLeave()', () => {
    it('should clear messages', () => {
      component.ionViewWillLeave();

      expect(mockMessageService.clearMessage).toHaveBeenCalled();
    });
  });
});