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

  const mockBike = BicycleFactory.create();
  const mockBikes = BicycleFactory.createMultiple(2);

  beforeEach(() => {
    //  HELPERS pour créer les spies
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



});