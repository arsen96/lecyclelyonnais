import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnicianPage } from './technician.page';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { TechnicianService } from '../../services/technician.service';
import { ZoneService } from '../../services/zone.service';
import { MessageService } from '../../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { 
  TechnicianFactory, 
  ZoneFactory,        
  createServiceSpy,
  createMessageServiceSpy,
  createActivatedRouteSpy,
  MOCK_PLACES           
} from '../../../test-fixtures/factories';

describe('TechnicianPage', () => {
  let component: TechnicianPage;
  let fixture: ComponentFixture<TechnicianPage>;
  let mockTechnicianService: jasmine.SpyObj<TechnicianService>;
  let mockZoneService: jasmine.SpyObj<ZoneService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockActivatedRoute: any;

  const mockTechnician = TechnicianFactory.create();
  const mockTechnicians = TechnicianFactory.createMultiple(2);
  const mockZones = ZoneFactory.createMultiple(2);

  beforeEach(() => {
    mockTechnicianService = createServiceSpy('TechnicianService', ['get', 'create', 'update']) as jasmine.SpyObj<TechnicianService>;
    mockZoneService = createServiceSpy('ZoneService', ['get']) as jasmine.SpyObj<ZoneService>;
    mockMessageService = createMessageServiceSpy();
    mockActivatedRoute = createActivatedRouteSpy();

    Object.defineProperty(mockTechnicianService, 'technicians', {
      value: mockTechnicians,
      writable: true
    });
    Object.defineProperty(mockZoneService, 'allZones', {
      value: mockZones,
      writable: true
    });

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [TechnicianPage],
      providers: [
        provideHttpClient(withFetch()),
        FormBuilder,
        { provide: TechnicianService, useValue: mockTechnicianService },
        { provide: ZoneService, useValue: mockZoneService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    fixture = TestBed.createComponent(TechnicianPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form management', () => {
    it('should initialize form with manageForm', async () => {
      mockTechnicianService.get.and.returnValue(Promise.resolve(mockTechnicians));
      
      await component.manageForm();
      
      expect(mockTechnicianService.get).toHaveBeenCalled();
      expect(component.technicianForm).toBeDefined();
      expect(component.technicianForm.get('first_name')).toBeDefined();
      expect(component.technicianForm.get('last_name')).toBeDefined();
      expect(component.technicianForm.get('email')).toBeDefined();
      expect(component.technicianForm.get('phone')).toBeDefined();
      expect(component.technicianForm.get('address')).toBeDefined();
    });

  });

  describe('Password generation', () => {
    it('should generate password correctly', async () => {
      await component.manageForm();
      
      component.generatePassword();
      
      const password = component.technicianForm.get('password')?.value;
      expect(password).toBeDefined();
      expect(password.length).toBe(8);
      expect(component.showPassword).toBe(true);
    });
  });

  describe('Address handling', () => {
    beforeEach(async () => {
      await component.manageForm();
    });

    it('should handle valid address change', () => {
      const mockPlace = MOCK_PLACES.VALID_PLACE;
      
      component.handleAddressChange(mockPlace);
      
      expect(component.technicianForm.get('address')?.value).toBe(mockPlace.formatted_address);
      expect(component.addressValidated).toBe(true);
    });

    it('should handle invalid address', () => {
      const invalidPlace = MOCK_PLACES.INVALID_PLACE;
      
      component.handleAddressChange(invalidPlace);
      
      expect(component.addressValidated).toBe(false);
    });

    it('should handle address with geometry location', () => {
      const placeWithGeometry = {
        geometry: { location: { lat: () => 40.7128, lng: () => -74.0060 } },
        formatted_address: '123 Test Street'
      };
      
      component.handleAddressChange(placeWithGeometry);
      
      expect(component.technicianForm.get('address')?.value).toBe('123 Test Street');
      expect(component.addressValidated).toBe(true);
    });
  });


  describe('Form validation', () => {
    beforeEach(async () => {
      await component.manageForm();
    });

    it('should validate required fields', () => {
      component.technicianForm.patchValue({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: ''
      });
      
      expect(component.technicianForm.valid).toBe(false);
      expect(component.technicianForm.get('first_name')?.hasError('required')).toBe(true);
      expect(component.technicianForm.get('email')?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const emailControl = component.technicianForm.get('email');
      
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);
      
      emailControl?.setValue('valid@email.com');
      expect(emailControl?.hasError('email')).toBe(false);
    });

  });

  describe('Utility functions', () => {
    it('should clear messages on leave', () => {
      component.ionViewWillLeave();
      
      expect(mockMessageService.clearMessage).toHaveBeenCalled();
    });

    it('should reset form correctly', async () => {
      await component.manageForm();
      component.addressValidated = true;
      
      component.resetForm();
      
      expect(mockMessageService.clearMessage).toHaveBeenCalled();
      expect(component.addressValidated).toBe(false);
      expect(component.technicianForm.pristine).toBe(true);
    });
  });

  describe('Factory usage examples', () => {
    it('should work with different technician types', () => {
      const basicTech = TechnicianFactory.create();
      const zoneSpecificTech = TechnicianFactory.forZone(2);
      const availableTech = TechnicianFactory.available();
      
      expect(basicTech.geographical_zone_id).toBeDefined();
      expect(zoneSpecificTech.geographical_zone_id).toBe(2);
      expect(availableTech.is_available).toBe(true);
    });

   
  
  });

  describe('Edge cases', () => {
    it('should handle empty technician list', async () => {
      mockTechnicianService.get.and.returnValue(Promise.resolve([]));
      
      await component.manageForm();
      
      expect(component.technicianForm).toBeDefined();
    });

    it('should handle form submission with partial data', async () => {
      await component.manageForm();
      component.technicianForm.patchValue({
        first_name: 'Partial',
      });
      component.addressValidated = true;
      
      await component.onSubmit();
      
      expect(mockTechnicianService.create).not.toHaveBeenCalled();
    });

    it('should handle password generation for existing technician', async () => {
      component.technicianSelected = mockTechnician;
      await component.manageForm();
      
      component.generatePassword();
      
      const password = component.technicianForm.get('password')?.value;
      expect(password).toBeDefined();
      expect(component.showPassword).toBe(true);
    });
  });


});