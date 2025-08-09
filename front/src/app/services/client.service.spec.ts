import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { StandardAuth } from 'src/app/services/auth/standard.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MessageService, Message } from 'src/app/services/message.service';
import { ClientService } from 'src/app/services/client.service';
import { GlobalService, UserRole } from 'src/app/services/global.service';
import { BehaviorSubject } from 'rxjs';
import { UsersPage } from '../pages/users/users.page';
import { AddressSuggestion } from '../components/address-autocomplete/address-autocomplete.component';
describe('UsersPage', () => {
  let component: UsersPage;
  let fixture: ComponentFixture<UsersPage>;
  let mockClientService: jasmine.SpyObj<ClientService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUser = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '0123456789',
    address: '123 Main St'
  };

  beforeEach(() => {
    const clientServiceSpy = jasmine.createSpyObj('ClientService', ['get', 'update'], {
      allClients: [mockUser]
    });
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['showToast', 'showMessage', 'clearMessage']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [UsersPage],
      providers: [
        FormBuilder,
        { provide: ClientService, useValue: clientServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: StandardAuth, useValue: {} },
        { provide: LoadingService, useValue: {} },
        { 
          provide: GlobalService, 
          useValue: { 
            userRole: new BehaviorSubject(UserRole.CLIENT),
            user: new BehaviorSubject(null)
          } 
        },
        { 
          provide: ActivatedRoute, 
          useValue: { 
            paramMap: of(new Map([['id', null]])) 
          } 
        }
      ]
    });

    fixture = TestBed.createComponent(UsersPage);
    component = fixture.componentInstance;
    
    mockClientService = TestBed.inject(ClientService) as jasmine.SpyObj<ClientService>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test de l'initialisation du formulaire
  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();

    expect(component.registrationForm).toBeDefined();
    expect(component.registrationForm.get('firstName')).toBeDefined();
    expect(component.registrationForm.get('email')).toBeDefined();
  });

  // Test de loadUserDetails
  it('should load user details correctly', async () => {
    mockClientService.get.and.returnValue(Promise.resolve(true));
    component.ngOnInit();

    await component.loadUserDetails(1);

    expect(component.selectedUser).toEqual(mockUser);
    expect(component.registrationForm.get('firstName')?.value).toBe('John');
  });

  // Test de updateUser
  it('should update user successfully', () => {
    component.ngOnInit();
    component.selectedUser = mockUser;
    component.resetPasswordMode = false; // Pas en mode reset
    // Remplir le formulaire avec des données valides
    component.registrationForm.patchValue({
      firstName: 'Updated',
      lastName: 'User',
      email: 'updated@test.com',
      phone: '0123456789',
      address: '123 Test St'
    });

    const updateResponse = { message: 'Success', data: mockUser };
    mockClientService.update.and.returnValue(of(updateResponse));

    component.updateUser();
  });

  it('should handle address change', () => {
    component.ngOnInit();
    const mockPlace: AddressSuggestion = { 
      label: '123 Test Street',
      coordinates: [48.8566, 2.3522],
      postcode: '75001',
      city: 'Paris',
      street: 'Test Street'
    };

    component.handleAddressChange(mockPlace);

    expect(component.registrationForm.get('address')?.value).toBe('123 Test Street');
    expect(component.addressValidated).toBe(true);
  });

  // Test de generatePassword
  it('should generate password', () => {
    component.ngOnInit();

    component.generatePassword();

    const password = component.registrationForm.get('password')?.value;
    expect(password).toBeDefined();
    expect(password.length).toBe(8);
    expect(component.showPassword).toBe(true);
  });

  // Test de enablePasswordReset
  it('should enable password reset mode', () => {
    component.ngOnInit();

    component.enablePasswordReset();

    expect(component.resetPasswordMode).toBe(true);
    expect(component.registrationForm.get('password')?.value).toBe('');
  });

  // Test de onSubmitRegister en mode update
  it('should call updateUser when selectedUser exists', () => {
    component.selectedUser = mockUser;
    spyOn(component, 'updateUser');

    component.onSubmitRegister();

    expect(component.updateUser).toHaveBeenCalled();
  });

  // Test de validation d'adresse
  it('should show error when address not validated for new user', () => {
    component.ngOnInit();
    component.selectedUser = null;
    component.addressValidated = false;
    component.registrationForm.patchValue({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com'
    });

    component.onSubmitRegister();

    expect(mockMessageService.showMessage).toHaveBeenCalledWith(
      'Veuillez sélectionner une adresse valide.',
      Message.danger
    );
  });


});