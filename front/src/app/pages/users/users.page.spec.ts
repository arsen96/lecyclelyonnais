import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UsersPage } from './users.page';
import { StandardAuth } from 'src/app/services/auth/standard.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MessageService, Message } from 'src/app/services/message.service';
import { ClientService } from 'src/app/services/client.service';
import { GlobalService, UserRole } from 'src/app/services/global.service';
import { BehaviorSubject } from 'rxjs';

describe('UsersPage', () => {
  let component: UsersPage;
  let fixture: ComponentFixture<UsersPage>;
  let mockStandardAuth: jasmine.SpyObj<StandardAuth>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockClientService: jasmine.SpyObj<ClientService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockGlobalService: any;

  const mockUser = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '0123456789',
    address: '123 Main St'
  };

  beforeEach(() => {
    const standardAuthSpy = jasmine.createSpyObj('StandardAuth', ['register']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['showLoaderUntilCompleted']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['showToast', 'showMessage', 'clearMessage']);
    const clientServiceSpy = jasmine.createSpyObj('ClientService', ['get', 'update'], {
      allClients: [mockUser]
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    mockActivatedRoute = {
      paramMap: of(new Map([['id', null]]))
    };

    mockGlobalService = {
      userRole: new BehaviorSubject(UserRole.CLIENT),
      user: new BehaviorSubject(null)
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [UsersPage],
      providers: [
        FormBuilder,
        { provide: StandardAuth, useValue: standardAuthSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ClientService, useValue: clientServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: GlobalService, useValue: mockGlobalService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(UsersPage);
    component = fixture.componentInstance;
    
    mockStandardAuth = TestBed.inject(StandardAuth) as jasmine.SpyObj<StandardAuth>;
    mockLoadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    mockClientService = TestBed.inject(ClientService) as jasmine.SpyObj<ClientService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should initialize form with validators', () => {
      component.ngOnInit();

      expect(component.registrationForm).toBeDefined();
      expect(component.registrationForm.get('firstName')).toBeDefined();
      expect(component.registrationForm.get('email')).toBeDefined();
      expect(component.registrationForm.get('password')).toBeDefined();
    });

    it('should load user details when userId exists', () => {
      mockActivatedRoute.paramMap = of(new Map([['id', '1']]));
      mockClientService.get.and.returnValue(Promise.resolve(true));
      spyOn(component, 'loadUserDetails');

      component.ngOnInit();

      expect(component.loadUserDetails).toHaveBeenCalledWith(1);
    });
  });

  describe('loadUserDetails()', () => {
    it('should load and patch user data', async () => {
      mockClientService.get.and.returnValue(Promise.resolve(true));
      component.ngOnInit();

      await component.loadUserDetails(1);

      expect(component.selectedUser).toEqual(mockUser);
      expect(component.registrationForm.get('firstName')?.value).toBe(mockUser.first_name);
      expect(component.registrationForm.get('lastName')?.value).toBe(mockUser.last_name);
    });

    it('should clear password validators for existing user', async () => {
      mockClientService.get.and.returnValue(Promise.resolve(true));
      component.ngOnInit();
      spyOn(component.registrationForm.get('password')!, 'clearValidators');

      await component.loadUserDetails(1);

      expect(component.registrationForm.get('password')!.clearValidators).toHaveBeenCalled();
    });
  });


  describe('generatePassword()', () => {
    it('should generate password and show it', () => {
      component.ngOnInit();

      component.generatePassword();

      const password = component.registrationForm.get('password')?.value;
      expect(password).toBeDefined();
      expect(password.length).toBe(8);
      expect(component.showPassword).toBe(true);
    });
  });

  describe('onSubmitRegister()', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.registrationForm.patchValue({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        phone: '0123456789',
        address: '123 Test St'
      });
    });


    it('should create new user when no selectedUser', () => {
      component.selectedUser = null;
      component.addressValidated = true;
      const registerResponse = { success: true };
      mockStandardAuth.register.and.returnValue(of(registerResponse));
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(registerResponse));

      component.onSubmitRegister();

      expect(mockStandardAuth.register).toHaveBeenCalledWith(component.registrationForm.value);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('list-zones');
    });

    it('should require valid address for new user', () => {
      component.selectedUser = null;
      component.addressValidated = false;

      component.onSubmitRegister();

      expect(mockMessageService.showMessage).toHaveBeenCalledWith(
        'Veuillez sélectionner une adresse valide.',
        Message.danger
      );
    });

    it('should handle registration errors', () => {
      component.selectedUser = null;
      component.addressValidated = true;
      const error = 'Registration failed';
      mockStandardAuth.register.and.returnValue(throwError(() => error));
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(throwError(() => error));
      spyOn(component, 'displayError');

      component.onSubmitRegister();

      expect(component.displayError).toHaveBeenCalledWith(error);
    });
  });

  describe('enablePasswordReset()', () => {
    it('should enable password reset mode', () => {
      component.ngOnInit();

      component.enablePasswordReset();

      expect(component.resetPasswordMode).toBe(true);
      expect(component.registrationForm.get('password')?.value).toBe('');
    });
  });

});