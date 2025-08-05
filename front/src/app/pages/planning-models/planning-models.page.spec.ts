import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { PlanningModelsPage } from './planning-models.page';
import { PlanningModelService } from 'src/app/services/planning-model.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MessageService, Message } from 'src/app/services/message.service';

// 🌟 IMPORT DES FIXTURES
import { 
  PlanningModelFactory, 
  createServiceSpy,
  createLoadingServiceSpy,
  createMessageServiceSpy,
  createActivatedRouteSpy,
  TEST_CONSTANTS
} from '../../../test-fixtures/factories';

describe('PlanningModelsPage', () => {
  let component: PlanningModelsPage;
  let fixture: ComponentFixture<PlanningModelsPage>;
  let mockPlanningService: jasmine.SpyObj<PlanningModelService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockActivatedRoute: any;

  // 🔥 FACTORY au lieu de données hardcodées
  const mockPlanningModel = PlanningModelFactory.create();

  beforeEach(() => {
    // 🌟 HELPERS pour créer les spies
    mockPlanningService = createServiceSpy('PlanningModelService', ['get', 'create', 'update']) as jasmine.SpyObj<PlanningModelService>;
    mockLoadingService = createLoadingServiceSpy();
    mockMessageService = createMessageServiceSpy();
    mockActivatedRoute = createActivatedRouteSpy();

    // Configuration des propriétés
    Object.defineProperty(mockPlanningService, 'allPlanningModels', {
      value: [],
      writable: true
    });

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [PlanningModelsPage],
      providers: [
        FormBuilder,
        { provide: PlanningModelService, useValue: mockPlanningService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    });

    fixture = TestBed.createComponent(PlanningModelsPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should initialize data structures correctly', () => {
      expect(component.displayedColumns).toEqual(['id', 'name']);
      expect(component.selectedModel).toBe(null);
      expect(component.pageSizes).toEqual(TEST_CONSTANTS.PAGINATION.PAGE_SIZES);
      expect(component.planningService).toBeDefined();
      expect(component.messageService).toBeDefined();
      expect(component.loaderService).toBeDefined();
    });
  });

  describe('Form initialization', () => {
    it('should initialize form with validators', () => {
      mockPlanningService.get.and.returnValue(Promise.resolve([]));

      component.ngOnInit();

      expect(component.planningForm).toBeDefined();
      expect(component.planningForm.get('intervention_type')).toBeDefined();
      expect(component.planningForm.get('name')).toBeDefined();
      expect(component.planningForm.get('start_time')).toBeDefined();
      expect(component.planningForm.get('end_time')).toBeDefined();
      expect(component.planningForm.get('slot_duration')).toBeDefined();
      expect(component.planningForm.get('available_days')).toBeDefined();
    });

    it('should load existing model when id is provided', async () => {
      mockActivatedRoute.snapshot.params = { id: '1' };
      mockPlanningService.get.and.returnValue(Promise.resolve([mockPlanningModel]));
      spyOn(component, 'loadModelForEdit');

      component.ngOnInit();
      await Promise.resolve();

      expect(component.loadModelForEdit).toHaveBeenCalledWith(mockPlanningModel);
    });
  });

  describe('Validation', () => {
    it('should validate at least one day selected', () => {
      // ✅ Valid: Au moins un jour sélectionné
      const validControl = { 
        value: PlanningModelFactory.createAvailableDays(['monday', 'friday'])
      } as any;

      const validResult = component.atLeastOneDaySelected(validControl);
      expect(validResult).toBe(null);

      // ❌ Invalid: Aucun jour sélectionné
      const invalidControl = { 
        value: PlanningModelFactory.createAvailableDays([])
      } as any;

      const invalidResult = component.atLeastOneDaySelected(invalidControl);
      expect(invalidResult).toEqual({ noDaySelected: false });
    });
  });

  describe('Model editing', () => {
    beforeEach(() => {
      mockPlanningService.get.and.returnValue(Promise.resolve([]));
      component.ngOnInit();
    });

    it('should load model for editing and patch form', () => {
      spyOn(component.planningForm, 'patchValue');

      component.loadModelForEdit(mockPlanningModel);

      expect(component.selectedModel).toBe(mockPlanningModel);
      expect(component.planningForm.patchValue).toHaveBeenCalledWith(
        jasmine.objectContaining({
          intervention_type: mockPlanningModel.intervention_type,
          name: mockPlanningModel.name,
          available_days: mockPlanningModel.available_days
        })
      );
    });

    it('should handle time conversion correctly', () => {
      const modelWithCustomTimes = PlanningModelFactory.create({
        start_time: '08:30',
        end_time: '16:45'
      });
      spyOn(component.planningForm, 'patchValue');

      component.loadModelForEdit(modelWithCustomTimes);

      expect(component.planningForm.patchValue).toHaveBeenCalledWith(
        jasmine.objectContaining({
          start_time: 8.5, // 08:30
          end_time: 16.75  // 16:45
        })
      );
    });

    it('should handle slot duration conversion', () => {
      // Factory avec durée personnalisée
      const modelWithDuration = PlanningModelFactory.create({
        slot_duration: { hours: 2, minutes: 30 }
      });
      spyOn(component.planningForm, 'patchValue');

      component.loadModelForEdit(modelWithDuration);

      expect(component.planningForm.patchValue).toHaveBeenCalledWith(
        jasmine.objectContaining({
          slot_duration: 2.5 
        })
      );
    });
  });

  describe('Form submission', () => {
    beforeEach(() => {
      mockPlanningService.get.and.returnValue(Promise.resolve([]));
      component.ngOnInit();
      
      // Factory pour données de formulaire
      const formData = PlanningModelFactory.formData({
        intervention_type: 'Maintenance',
        name: 'Test Model',
        start_time: 9,
        end_time: 17,
        slot_duration: 2,
        available_days: PlanningModelFactory.createAvailableDays(['monday'])
      });
      component.planningForm.patchValue(formData);
    });

    it('should create new model', () => {
      component.selectedModel = null;
      const createResponse = { message: 'Created successfully' };
      mockPlanningService.create.and.returnValue(of(createResponse));
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(createResponse));
      spyOn(component.planningForm, 'reset');

      component.onSubmit();

      expect(mockPlanningService.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          slot_duration: '2 hours'
        })
      );
      expect(mockMessageService.showToast).toHaveBeenCalledWith('Created successfully', Message.success);
      expect(component.planningForm.reset).toHaveBeenCalled();
    });

    it('should update existing model', () => {
      component.selectedModel = mockPlanningModel;
      const updateResponse = { message: 'Updated successfully' };
      mockPlanningService.update.and.returnValue(of(updateResponse));
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(updateResponse));

      component.onSubmit();

      expect(mockPlanningService.update).toHaveBeenCalledWith(
        jasmine.objectContaining({
          id: mockPlanningModel.id,
          slot_duration: '2 hours'
        })
      );
      expect(mockMessageService.showToast).toHaveBeenCalledWith('Updated successfully', Message.success);
    });

    it('should not submit when form is invalid', () => {
      component.planningForm.patchValue({ name: '' }); // Form invalide
      spyOn(console, 'log');

      component.onSubmit();

      expect(mockPlanningService.create).not.toHaveBeenCalled();
      expect(mockPlanningService.update).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Form is invalid');
    });
  });

  describe('View initialization', () => {
    it('should set sort and paginator after view init', () => {
      component.ngAfterViewInit();

      expect(component.dataSource.sort).toBe(component.sort);
      expect(component.dataSource.paginator).toBe(component.paginator);
    });
  });

  describe('Utility functions', () => {
    it('should have empty sortData implementation', () => {
      expect(component.sortData).toBeDefined();
      expect(() => component.sortData({})).not.toThrow();
    });
  });

  describe('Factory usage examples', () => {
    it('should work with different planning model types', () => {
      const maintenanceModel = PlanningModelFactory.maintenance();
      const repairModel = PlanningModelFactory.repair();
      
      expect(maintenanceModel.intervention_type).toBe('Maintenance');
      expect(repairModel.intervention_type).toBe('Réparation');
    });

    it('should create models with specific days', () => {
      const weekdaysModel = PlanningModelFactory.weekdays();
      const weekendModel = PlanningModelFactory.weekend();
      
      expect(weekdaysModel.available_days.monday).toBe(true);
      expect(weekdaysModel.available_days.saturday).toBe(false);
      expect(weekendModel.available_days.saturday).toBe(true);
      expect(weekendModel.available_days.monday).toBe(false);
    });

    it('should create available days with helper', () => {
      const customDays = PlanningModelFactory.createAvailableDays(['monday', 'wednesday', 'friday']);
      
      expect(customDays.monday).toBe(true);
      expect(customDays.tuesday).toBe(false);
      expect(customDays.wednesday).toBe(true);
      expect(customDays.thursday).toBe(false);
      expect(customDays.friday).toBe(true);
    });

    it('should work with time range models', () => {
      const morningModel = PlanningModelFactory.timeRange('08:00', '12:00');
      const afternoonModel = PlanningModelFactory.timeRange('14:00', '18:00');
      
      expect(morningModel.start_time).toBe('08:00');
      expect(morningModel.end_time).toBe('12:00');
      expect(afternoonModel.start_time).toBe('14:00');
      expect(afternoonModel.end_time).toBe('18:00');
    });
  });

  describe('Edge cases', () => {
    beforeEach(() => {
      mockPlanningService.get.and.returnValue(Promise.resolve([]));
      component.ngOnInit();
    });

    it('should handle model not found when loading for edit', async () => {
      mockActivatedRoute.snapshot.params = { id: '999' };
      mockPlanningService.get.and.returnValue(Promise.resolve([])); // Aucun modèle trouvé

      component.ngOnInit();
      await Promise.resolve();

      expect(component.selectedModel).toBe(null);
    });

    it('should handle invalid time format gracefully', () => {
      const invalidTimeModel = PlanningModelFactory.create({
        start_time: 'invalid',
        end_time: 'also-invalid'
      });

      expect(() => component.loadModelForEdit(invalidTimeModel)).not.toThrow();
    });

    it('should handle form with all days deselected', () => {
      const noDaysModel = PlanningModelFactory.create({
        available_days: PlanningModelFactory.createAvailableDays([])
      });

      component.loadModelForEdit(noDaysModel);
      
      const control = component.planningForm.get('available_days');
      const validationResult = component.atLeastOneDaySelected(control);
      
      expect(validationResult).toEqual({ noDaySelected: false });
    });

    it('should handle fractional hours in slot duration', () => {
      const fractionalModel = PlanningModelFactory.create({
        slot_duration: { hours: 1, minutes: 45 } 
      });

      component.loadModelForEdit(fractionalModel);

      expect(component.planningForm.get('slot_duration')?.value).toBe(1.75);
    });
  });


});