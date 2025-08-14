import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BikePage } from './bike.page';
import { BicycleService } from 'src/app/services/bicycle.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MessageService } from 'src/app/services/message.service';

import { 
  BicycleFactory, 
  createServiceSpy,
  createLoadingServiceSpy,
  createMessageServiceSpy,
  createActivatedRouteSpy
} from '../../../../test-fixtures';

describe('BikePage', () => {
  let component: BikePage;
  let fixture: ComponentFixture<BikePage>;
  let mockBicycleService: jasmine.SpyObj<BicycleService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockActivatedRoute: any;

  // 🔥 FACTORY au lieu de données hardcodées
  const mockBike = BicycleFactory.create();
  const mockBikes = BicycleFactory.createMultiple(2);

  beforeEach(() => {
    // 🌟 HELPERS pour créer les spies
    mockBicycleService = createServiceSpy('BicycleService', ['getUserBicycles', 'create', 'update']) as jasmine.SpyObj<BicycleService>;
    mockLoadingService = createLoadingServiceSpy();
    mockMessageService = createMessageServiceSpy();
    mockActivatedRoute = createActivatedRouteSpy();

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [BikePage],
      providers: [
        FormBuilder,
        { provide: BicycleService, useValue: mockBicycleService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(BikePage);
    component = fixture.componentInstance;

    // Setup default mocks
    mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(mockBikes));
    mockBicycleService.getUserBicycles.and.returnValue(of(mockBikes));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize form with validators', () => {
      component.ngOnInit();

      expect(component.bikeForm).toBeDefined();
      expect(component.bikeForm.get('brand')).toBeDefined();
      expect(component.bikeForm.get('model')).toBeDefined();
      expect(component.bikeForm.get('year')).toBeDefined();
      expect(component.bikeForm.get('type')).toBeDefined();
    });


    it('should have required validators', () => {
      component.ngOnInit();
      const form = component.bikeForm;

      form.patchValue({ brand: '', model: '', year: '', type: '' });

      expect(form.get('brand')?.hasError('required')).toBe(true);
      expect(form.get('model')?.hasError('required')).toBe(true);
      expect(form.get('year')?.hasError('required')).toBe(true);
      expect(form.get('type')?.hasError('required')).toBe(true);
    });

    it('should validate year pattern', () => {
      component.ngOnInit();
      const yearControl = component.bikeForm.get('year');

      yearControl?.setValue('abc');
      expect(yearControl?.hasError('pattern')).toBe(true);

      yearControl?.setValue('23');
      expect(yearControl?.hasError('pattern')).toBe(true);

      yearControl?.setValue('2023');
      expect(yearControl?.hasError('pattern')).toBe(false);
    });
  });

  describe('Data loading', () => {
    beforeEach(() => component.ngOnInit());

    it('should load bikes without patching form when no bikeId', () => {
      component.bikeId = null;
      
      component.ionViewDidEnter();

      expect(mockLoadingService.showLoaderUntilCompleted).toHaveBeenCalledWith(
        mockBicycleService.getUserBicycles()
      );
      expect(component.bikeSelected).toBe(null);
    });

    it('should load and patch form when bikeId exists', () => {
      component.bikeId = mockBike.id;
      // 🔧 CORRECTION: mockBikes contient le mockBike
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of([mockBike]));
      spyOn(component.bikeForm, 'patchValue');
      
      component.ionViewDidEnter();

      expect(component.bikeSelected).toEqual(mockBike);
      expect(component.bikeForm.patchValue).toHaveBeenCalledWith(mockBike);
    });

    it('should handle bike not found', () => {
      component.bikeId = 999;
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of([]));
      
      component.ionViewDidEnter();

      expect(component.bikeSelected).toBeUndefined();
    });
  });

  describe('Form submission', () => {
    beforeEach(() => {
      component.ngOnInit();
      const formData = BicycleFactory.create({
        brand: 'Test Brand',
        model: 'Test Model',
        year: 2023,
        type: 'Vélo classique'
      });
      component.bikeForm.patchValue(formData);
    });

    it('should create new bike', () => {
      component.bikeSelected = null;
      const createResponse = { message: 'Created successfully' };
      mockBicycleService.create.and.returnValue(of(createResponse));
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(createResponse));
      spyOn(component.bikeForm, 'reset');

      component.onSubmit();

      expect(mockBicycleService.create).toHaveBeenCalledWith(component.bikeForm.value);
      expect(mockMessageService.showToast).toHaveBeenCalledWith('Bike saved successfully', 'success');
      expect(component.bikeForm.reset).toHaveBeenCalled();
    });

    it('should update existing bike', () => {
      component.bikeSelected = mockBike;
      component.bikeId = mockBike.id;
      const updateResponse = { message: 'Updated successfully' };
      mockBicycleService.update.and.returnValue(of(updateResponse));
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(updateResponse));
      spyOn(component.bikeForm, 'reset');

      component.onSubmit();

      expect(mockBicycleService.update).toHaveBeenCalledWith(mockBike.id, component.bikeForm.value);
      expect(mockMessageService.showToast).toHaveBeenCalledWith('Bike saved successfully', 'success');
      expect(component.bikeForm.reset).not.toHaveBeenCalled();
    });


    it('should not submit when form is invalid', () => {
      component.bikeForm.patchValue({ brand: '', model: '', year: '', type: '' });

      component.onSubmit();

      expect(mockBicycleService.create).not.toHaveBeenCalled();
      expect(mockBicycleService.update).not.toHaveBeenCalled();
      expect(mockMessageService.showToast).toHaveBeenCalledWith('Veuillez remplir tous les champs', 'danger');
    });
  });



  describe('Edge cases', () => {
    beforeEach(() => component.ngOnInit());


    it('should handle form validation with edge year values', () => {
      const yearControl = component.bikeForm.get('year');
      
      // Test limite basse
      yearControl?.setValue('1000');
      expect(yearControl?.hasError('pattern')).toBe(false);
      
      // Test limite haute
      yearControl?.setValue('9999');
      expect(yearControl?.hasError('pattern')).toBe(false);
      
      // Test invalide
      yearControl?.setValue('12345');
      expect(yearControl?.hasError('pattern')).toBe(true);
    });

    it('should handle empty bike list response', () => {
      component.bikeId = 1;
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of([]));
      
      component.ionViewDidEnter();
      
      expect(component.bikeSelected).toBeUndefined();
    });
  });
});