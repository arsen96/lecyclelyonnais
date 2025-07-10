import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { BikePage } from './bike.page';
import { BicycleService } from 'src/app/services/bicycle.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MessageService } from 'src/app/services/message.service';
import { Bicycle } from 'src/app/models/bicycle';

describe('BikePage', () => {
  let component: BikePage;
  let fixture: ComponentFixture<BikePage>;
  let mockBicycleService: jasmine.SpyObj<BicycleService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockActivatedRoute: any;

  const mockBike: Bicycle = {
    id: 1,
    brand: 'Test Brand',
    model: 'Test Model',
    year: 2023,
    type: 'Vélo classique'
  };

  const mockBikes: Bicycle[] = [mockBike];

  beforeEach(() => {
    const bicycleServiceSpy = jasmine.createSpyObj('BicycleService', [
      'getUserBicycles', 'create', 'update'
    ]);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', [
      'showLoaderUntilCompleted'
    ]);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', [
      'showToast', 'clearMessage'
    ]);

    mockActivatedRoute = {
      snapshot: {
        params: { id: null }
      }
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [BikePage],
      providers: [
        FormBuilder,
        { provide: BicycleService, useValue: bicycleServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    });

    fixture = TestBed.createComponent(BikePage);
    component = fixture.componentInstance;
    
    mockBicycleService = TestBed.inject(BicycleService) as jasmine.SpyObj<BicycleService>;
    mockLoadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;

    // Setup default mocks
    mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(mockBikes));
    mockBicycleService.getUserBicycles.and.returnValue(of(mockBikes));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should initialize form with default values', () => {
      component.ngOnInit();

      expect(component.bikeForm).toBeDefined();
      expect(component.bikeForm.get('brand')).toBeDefined();
      expect(component.bikeForm.get('model')).toBeDefined();
      expect(component.bikeForm.get('year')).toBeDefined();
      expect(component.bikeForm.get('type')).toBeDefined();
    });

    it('should set required validators', () => {
      component.ngOnInit();

      const brandControl = component.bikeForm.get('brand');
      const modelControl = component.bikeForm.get('model');
      const yearControl = component.bikeForm.get('year');
      const typeControl = component.bikeForm.get('type');

      brandControl?.setValue('');
      modelControl?.setValue('');
      yearControl?.setValue('');
      typeControl?.setValue('');

      expect(brandControl?.invalid).toBe(true);
      expect(modelControl?.invalid).toBe(true);
      expect(yearControl?.invalid).toBe(true);
      expect(typeControl?.invalid).toBe(true);
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

  describe('ionViewDidEnter()', () => {
    it('should load bikes and not patch form when no bikeId', () => {
      component.bikeId = null;
      
      component.ionViewDidEnter();

      expect(mockLoadingService.showLoaderUntilCompleted).toHaveBeenCalledWith(
        mockBicycleService.getUserBicycles()
      );
      expect(component.bikeSelected).toBe(null);
    });

    it('should load bikes and patch form when bikeId exists', () => {
      component.bikeId = 1;
      component.ngOnInit();
      spyOn(component.bikeForm, 'patchValue');
      
      component.ionViewDidEnter();

      expect(mockLoadingService.showLoaderUntilCompleted).toHaveBeenCalled();
      expect(component.bikeSelected).toEqual(mockBike);
      expect(component.bikeForm.patchValue).toHaveBeenCalledWith(mockBike);
    });

    it('should handle bike not found', () => {
      component.bikeId = 999;
      component.ngOnInit();
      
      component.ionViewDidEnter();

      expect(component.bikeSelected).toBe(undefined);
    });
  });

  describe('onSubmit()', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.bikeForm.patchValue({
        brand: 'Test Brand',
        model: 'Test Model',
        year: '2023',
        type: 'Vélo classique'
      });
    });

    it('should create new bike when bikeSelected is null', () => {
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

    it('should update existing bike when bikeSelected exists', () => {
      component.bikeSelected = mockBike;
      component.bikeId = 1;
      const updateResponse = { message: 'Updated successfully' };
      mockBicycleService.update.and.returnValue(of(updateResponse));
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(updateResponse));
      spyOn(component.bikeForm, 'reset');

      component.onSubmit();

      expect(mockBicycleService.update).toHaveBeenCalledWith(1, component.bikeForm.value);
      expect(mockMessageService.showToast).toHaveBeenCalledWith('Bike saved successfully', 'success');
      expect(component.bikeForm.reset).not.toHaveBeenCalled();
    });

    it('should handle service errors', () => {
      component.bikeSelected = null;
      const error = { message: 'Creation failed' };
      mockBicycleService.create.and.returnValue(throwError(() => error));
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(mockMessageService.showToast).toHaveBeenCalledWith(error.message, 'danger');
    });

    it('should not submit when form is invalid', () => {
      component.bikeForm.patchValue({
        brand: '',
        model: '',
        year: '',
        type: ''
      });

      component.onSubmit();

      expect(mockBicycleService.create).not.toHaveBeenCalled();
      expect(mockBicycleService.update).not.toHaveBeenCalled();
      expect(mockMessageService.showToast).toHaveBeenCalledWith('Veuillez remplir tous les champs', 'danger');
    });
  });

  describe('ionViewWillLeave()', () => {
    it('should clear messages', () => {
      component.ionViewWillLeave();

      expect(mockMessageService.clearMessage).toHaveBeenCalled();
    });
  });

});