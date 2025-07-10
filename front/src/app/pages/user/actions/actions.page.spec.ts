import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { ActionsPage } from './actions.page';
import { AuthBaseService } from 'src/app/services/auth/auth-base.service';
import { GlobalService } from 'src/app/services/global.service';
import { MessageService, Message } from 'src/app/services/message.service';
import { ZoneService } from 'src/app/services/zone.service';
import { LoadingService } from 'src/app/services/loading.service';
import { InterventionService } from 'src/app/services/intervention.service';
import { TechnicianService } from 'src/app/services/technician.service';
import { BicycleService } from 'src/app/services/bicycle.service';
import { BehaviorSubject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

describe('ActionsPage', () => {
  let component: ActionsPage;
  let fixture: ComponentFixture<ActionsPage>;
  let mockZoneService: jasmine.SpyObj<ZoneService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockBicycleService: jasmine.SpyObj<BicycleService>;
  let mockGlobalService: any;

  const mockZone = {
    id: 1,
    zone_name: 'Zone 1',
    created_at: '2024-01-01',
    geojson: {
      type: 'FeatureCollection',
      features: [
        {   
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
          }
        }
      ]
    },
    model_planification: {
      maintenance: {
        available_days: JSON.stringify({ monday: true, tuesday: true }),
        start_time: '09:00',
        end_time: '17:00',
        slot_duration: '2:00'
      }
    }
  };


  beforeEach(() => {
    const zoneServiceSpy = jasmine.createSpyObj('ZoneService', ['isAddressInZone', 'get']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['showMessage', 'showToast']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['showLoaderUntilCompleted']);
    const bicycleServiceSpy = jasmine.createSpyObj('BicycleService', ['getUserBicycles']);
    
    mockGlobalService = {
      user: new BehaviorSubject({ id: 1, address: null }),
      isAuthenticated: new BehaviorSubject(true)
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ActionsPage],
      providers: [
        FormBuilder,
        { provide: ZoneService, useValue: zoneServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: BicycleService, useValue: bicycleServiceSpy },
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: AuthBaseService, useValue: {} },
        { provide: InterventionService, useValue: {} },
        { provide: TechnicianService, useValue: {} },
        { provide: ChangeDetectorRef, useValue: { detectChanges: () => {} } }
      ]
    });

    fixture = TestBed.createComponent(ActionsPage);
    component = fixture.componentInstance;
    
    mockZoneService = TestBed.inject(ZoneService) as jasmine.SpyObj<ZoneService>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    mockLoadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    mockBicycleService = TestBed.inject(BicycleService) as jasmine.SpyObj<BicycleService>;

    mockBicycleService.getUserBicycles.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should initialize all forms', () => {
      component.ngOnInit();

      expect(component.addressFormGroup).toBeDefined();
      expect(component.detailsFormGroup).toBeDefined();
      expect(component.operationFormGroup).toBeDefined();
      expect(component.maintenanceFormGroup).toBeDefined();
      expect(component.repairFormGroup).toBeDefined();
      expect(component.loginFormGroup).toBeDefined();
    });

    it('should set minDate to today', () => {
      component.ngOnInit();
      const today = new Date().toISOString().split('T')[0];
      
      expect(component.minDate).toBe(today);
    });
  });

  describe('handleAddressChange()', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should update address when place has geometry', () => {
      const mockPlace = {
        geometry: { location: {} },
        formatted_address: '123 Test Street'
      };

      component.handleAddressChange(mockPlace);

      expect(component.addressFormGroup.get('address')?.value).toBe('123 Test Street');
      expect(component.addressValidated).toBe(true);
    });

    it('should not update when place has no geometry', () => {
      const mockPlace = { formatted_address: '123 Test Street' };

      component.handleAddressChange(mockPlace);

      expect(component.addressValidated).toBe(false);
    });
  });

  describe('onAddressSubmit()', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.addressFormGroup.patchValue({ address: 'Test Address' });
    });


    it('should show error when address not in zone', async () => {
      component.addressValidated = true;
      const errorResponse = { success: false, message: 'Address not in zone' };
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(errorResponse));

      await component.onAddressSubmit();

      expect(mockMessageService.showMessage).toHaveBeenCalledWith('Address not in zone', Message.danger);
      expect(component.displayError).toBe(true);
    });

    it('should show error when address not validated', async () => {
      component.addressValidated = false;

      await component.onAddressSubmit();

      expect(mockMessageService.showMessage).toHaveBeenCalledWith(
        'Veuillez saisir une adresse valide',
        Message.danger
      );
    });
  });

  describe('onBicycleSelect()', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should update details form with selected bicycle', () => {
      const mockBicycle = {
        id: 1,
        brand: 'Trek',
        model: 'Domane',
        year: 2023,
        type: 'Vélo classique'
      };

      component.onBicycleSelect(mockBicycle);

      expect(component.selectedBicycle).toBe(mockBicycle);
      expect(component.detailsFormGroup.get('brand')?.value).toBe('Trek');
      expect(component.detailsFormGroup.get('model')?.value).toBe('Domane');
    });
  });


  describe('isDateEnabled()', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.concernedZone = mockZone as any;
      component.operationFormGroup.patchValue({ operation: 'maintenance' });
    });

    it('should return true for enabled dates', () => {
      const monday = new Date('2024-01-01'); 
      const mondayIso = monday.toISOString();

      const result = component.isDateEnabled(mondayIso);

      expect(result).toBe(true);
    });

    it('should return false when no zone or operation', () => {
      component.concernedZone = null;

      const result = component.isDateEnabled('2024-01-01');

      expect(result).toBe(false);
    });
  });

  describe('changeAddressValidated()', () => {
    it('should set addressValidated to false', () => {
      component.addressValidated = true;

      component.changeAddressValidated();

      expect(component.addressValidated).toBe(false);
    });
  });


});