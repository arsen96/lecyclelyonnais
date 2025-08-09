import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TechnicianPage } from './technician.page';
import { TechnicianService } from 'src/app/services/technician.service';
import { ZoneService } from 'src/app/services/zone.service';
import { MessageService } from 'src/app/services/message.service';
import { AddressSuggestion } from 'src/app/components/address-autocomplete/address-autocomplete.component';
import { Technician } from 'src/app/models/technicians';

describe('TechnicianPage', () => {
  let component: TechnicianPage;
  let fixture: ComponentFixture<TechnicianPage>;
  let mockTechnicianService: jasmine.SpyObj<TechnicianService>;
  let mockZoneService: jasmine.SpyObj<ZoneService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  const testTechnician: Technician = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@test.com',
    phone: '0123456789',
    address: '123 Test Street',
    created_at: '2024-01-01',
    geographical_zone_id: 1,
    is_available: true
  };

  beforeEach(() => {
    mockTechnicianService = jasmine.createSpyObj('TechnicianService', ['get', 'create', 'update']);
    mockZoneService = jasmine.createSpyObj('ZoneService', ['get']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['showMessage', 'clearMessage']);

    mockTechnicianService.technicians = [testTechnician];

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [TechnicianPage],
      providers: [
        FormBuilder,
        { provide: TechnicianService, useValue: mockTechnicianService },
        { provide: ZoneService, useValue: mockZoneService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(TechnicianPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', async () => {
    mockTechnicianService.get.and.returnValue(Promise.resolve([]));
    
    await component.manageForm();
    
    expect(component.technicianForm).toBeDefined();
    expect(component.technicianForm.get('first_name')).toBeDefined();
    expect(component.technicianForm.get('email')).toBeDefined();
  });

  it('should load technician when editing', async () => {
    component.technicianId = 1;
    mockTechnicianService.get.and.returnValue(Promise.resolve([]));
    
    await component.manageForm();
    
    expect(component.technicianSelected).toBe(testTechnician);
    expect(component.technicianForm.get('first_name')?.value).toBe('John');
  });

  it('should generate password', async () => {
    mockTechnicianService.get.and.returnValue(Promise.resolve([]));
    await component.manageForm();
    
    component.generatePassword();
    
    const password = component.technicianForm.get('password')?.value;
    expect(password).toBeTruthy();
    expect(password.length).toBe(8);
    expect(component.showPassword).toBe(true);
  });

  it('should validate form', async () => {
    mockTechnicianService.get.and.returnValue(Promise.resolve([]));
    await component.manageForm();
    
    expect(component.technicianForm.valid).toBeFalse();
    
    component.technicianForm.patchValue({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@test.com',
      password: 'password123',
      phone: '0123456789'
    });
    
    expect(component.technicianForm.valid).toBeTrue();
  });

  it('should handle address change', async () => {
    mockTechnicianService.get.and.returnValue(Promise.resolve([]));
    await component.manageForm();
    
    const mockPlace: AddressSuggestion = { 
      label: '123 New Street',
      coordinates: [48.8566, 2.3522],
      postcode: '75001',
      city: 'Paris',
      street: 'New Street'
    };
    
    component.handleAddressChange(mockPlace);
    
    expect(component.technicianForm.get('address')?.value).toBe('123 New Street');
    expect(component.addressValidated).toBe(true);
  });

  it('should create technician on submit', async () => {
    mockTechnicianService.get.and.returnValue(Promise.resolve([]));
    await component.manageForm();
    
    component.technicianForm.patchValue({
      first_name: 'New',
      last_name: 'Tech',
      email: 'new@test.com',
      password: 'password123',
      phone: '0123456789'
    });
    component.addressValidated = true;
    
    mockTechnicianService.create.and.returnValue(Promise.resolve({ message: 'Success' }));
    
    await component.onSubmit();
    
    expect(mockTechnicianService.create).toHaveBeenCalled();
  });

});