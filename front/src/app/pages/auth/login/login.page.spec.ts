import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { LoginPage } from './login.page';
import { StandardAuth } from 'src/app/services/auth/standard.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MessageService } from 'src/app/services/message.service';
import { CompanyService } from 'src/app/services/company.service';
import { GlobalService } from 'src/app/services/global.service';
import { OauthService } from 'src/app/services/auth/oauth.service';
import { BicycleService } from 'src/app/services/bicycle.service';
import { TechnicianService } from 'src/app/services/technician.service';
import { InterventionService } from 'src/app/services/intervention.service';
import { AddressSuggestion } from 'src/app/components/address-autocomplete/address-autocomplete.component';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let mockStandardAuth: jasmine.SpyObj<StandardAuth>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockStandardAuth = jasmine.createSpyObj('StandardAuth', ['loginStandard', 'register']);
    mockLoadingService = jasmine.createSpyObj('LoadingService', ['showLoaderUntilCompleted']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['showMessage', 'clearMessage']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    const mockGlobalService = {
      isAuthenticated: new BehaviorSubject(false),
      loadAllData: jasmine.createSpy()
    };

    const mockCompanyService = {
      subdomainREQ: { domain: 'test' }
    };

    const mockOauthService = {
      decodeJWT: jasmine.createSpy(),
      loginOauthApi: jasmine.createSpy(),
      loginOauth: jasmine.createSpy(),
      oAuthService: { logOut: jasmine.createSpy() }
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FormBuilder,
        { provide: StandardAuth, useValue: mockStandardAuth },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: Router, useValue: mockRouter },
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: OauthService, useValue: mockOauthService },
        { provide: BicycleService, useValue: {} },
        { provide: TechnicianService, useValue: {} },
        { provide: InterventionService, useValue: {} },
        { provide: ActivatedRoute, useValue: { fragment: of(null) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should initialize registration form', () => {
    expect(component.registrationForm).toBeDefined();
    expect(component.registrationForm.get('firstName')).toBeDefined();
    expect(component.registrationForm.get('email')).toBeDefined();
  });

  it('should validate login form', () => {
    expect(component.loginForm.valid).toBeFalse();

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should handle address change', () => {
    const mockPlace: AddressSuggestion = { 
      label: '123 Test Street',
      coordinates: [48.8566, 2.3522],
      postcode: '75001',
      city: 'Paris',
      street: 'Test Street'
    };
    
    component.handleAddressChange(mockPlace);
    
    expect(component.registrationForm.get('address')?.value).toBe('123 Test Street');
    expect(component.addressValidated).toBeTrue();
  });


});