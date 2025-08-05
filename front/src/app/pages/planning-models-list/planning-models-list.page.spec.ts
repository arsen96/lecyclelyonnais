import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { of, throwError } from 'rxjs';

import { PlanningModelsListPage } from './planning-models-list.page';
import { PlanningModelService } from 'src/app/services/planning-model.service';
import { MessageService } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';

describe('PlanningModelsListPage', () => {
  let component: PlanningModelsListPage;
  let fixture: ComponentFixture<PlanningModelsListPage>;
  let mockPlanningModelService: jasmine.SpyObj<PlanningModelService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  const mockPlanningModels = [
    {
      id: 1,
      name: 'Morning Shift',
      intervention_type: 'Maintenance',
      start_time: '08:00',
      end_time: '12:00',
      slot_duration: { hours: 2, minutes: 0 },
      available_days: {
        monday: true,
        tuesday: true,
        wednesday: false,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      }
    },
    {
      id: 2,
      name: 'Afternoon Shift',
      intervention_type: 'Réparation',
      start_time: '14:00',
      end_time: '18:00',
      slot_duration: { hours: 1, minutes: 30 },
      available_days: {
        monday: false,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: false,
        saturday: true,
        sunday: false
      }
    }
  ];

  beforeEach(() => {
    const planningModelServiceSpy = jasmine.createSpyObj('PlanningModelService', ['get', 'delete']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['showToast']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['setLoading', 'showLoaderUntilCompleted']);

    TestBed.configureTestingModule({
      declarations: [PlanningModelsListPage],
      providers: [
        { provide: PlanningModelService, useValue: planningModelServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(PlanningModelsListPage);
    component = fixture.componentInstance;
    
    mockPlanningModelService = TestBed.inject(PlanningModelService) as jasmine.SpyObj<PlanningModelService>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    mockLoadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  describe('deleteSelected()', () => {
    beforeEach(() => {
      component.dataSource.data = [...mockPlanningModels];
    });

    it('should delete single planning model by elementId', () => {
      const deleteResponse = { message: 'Planning model deleted successfully' };
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(deleteResponse));
      mockPlanningModelService.delete.and.returnValue(of(deleteResponse));

      component.deleteSelected(1);

      expect(mockPlanningModelService.delete).toHaveBeenCalledWith([1]);
      expect(component.dataSource.data.length).toBe(1);
      expect(component.dataSource.data.find(p => p.id === 1)).toBeUndefined();
      expect(mockMessageService.showToast).toHaveBeenCalledWith('Planning model deleted successfully', 'success');
    });

    it('should delete multiple selected planning models', () => {
      const deleteResponse = { message: 'Planning models deleted successfully' };
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(deleteResponse));
      mockPlanningModelService.delete.and.returnValue(of(deleteResponse));
      component.selection.select(mockPlanningModels[0], mockPlanningModels[1]);

      component.deleteSelected();

      expect(mockPlanningModelService.delete).toHaveBeenCalledWith([1, 2]);
      expect(component.dataSource.data.length).toBe(0);
      expect(mockMessageService.showToast).toHaveBeenCalledWith('Planning models deleted successfully', 'success');
    });

    it('should handle delete errors', () => {
      const errorMessage = 'Delete failed';
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(throwError(() => errorMessage));
      spyOn(console, 'error');

      component.deleteSelected(1);

      expect(console.error).toHaveBeenCalledWith('Delete error:', errorMessage);
      expect(mockMessageService.showToast).toHaveBeenCalledWith(errorMessage, 'danger');
    });

    it('should log selected IDs for debugging', () => {
      const deleteResponse = { message: 'Success' };
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(deleteResponse));
      mockPlanningModelService.delete.and.returnValue(of(deleteResponse));
      spyOn(console, 'log');

      component.deleteSelected(1);

      expect(console.log).toHaveBeenCalledWith('Deleting items with IDs:', [1]);
    });

    it('should delete selected items when no elementId provided', () => {
      const deleteResponse = { message: 'Selected planning models deleted' };
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(deleteResponse));
      mockPlanningModelService.delete.and.returnValue(of(deleteResponse));
      component.selection.select(mockPlanningModels[0]);

      component.deleteSelected();

      expect(mockPlanningModelService.delete).toHaveBeenCalledWith([1]);
      expect(component.dataSource.data.length).toBe(1);
      expect(component.dataSource.data[0].id).toBe(2);
    });
  });



  describe('getAvailableDays()', () => {
    it('should return formatted available days string', () => {
      const availableDays = {
        monday: true,
        tuesday: false,
        wednesday: true,
        thursday: false,
        friday: true,
        saturday: false,
        sunday: false
      };

      const result = component.getAvailableDays(availableDays);

      expect(result).toBe('Lundi, Mercredi, Vendredi');
    });

    it('should return empty string when no days are available', () => {
      const availableDays = {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      };

      const result = component.getAvailableDays(availableDays);

      expect(result).toBe('');
    });

    it('should return all days when all are available', () => {
      const availableDays = {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true
      };

      const result = component.getAvailableDays(availableDays);

      expect(result).toBe('Lundi, Mardi, Mercredi, Jeudi, Vendredi, Samedi, Dimanche');
    });

    it('should handle single day', () => {
      const availableDays = {
        monday: true,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      };

      const result = component.getAvailableDays(availableDays);

      expect(result).toBe('Lundi');
    });

    it('should handle weekend only', () => {
      const availableDays = {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: true,
        sunday: true
      };

      const result = component.getAvailableDays(availableDays);

      expect(result).toBe('Samedi, Dimanche');
    });
  });

  describe('Component initialization', () => {
    it('should initialize displayedColumns correctly', () => {
      expect(component.displayedColumns).toEqual([
        'select', 'id', 'name', 'intervention_type', 'time', 'available_days', 'actions'
      ]);
    });

    it('should initialize dataSource as MatTableDataSource', () => {
      expect(component.dataSource).toBeInstanceOf(MatTableDataSource);
    });

    it('should initialize selection as SelectionModel', () => {
      expect(component.selection).toBeInstanceOf(SelectionModel);
      expect(component.selection.isMultipleSelection()).toBe(true);
    });

    it('should initialize pageSizes correctly', () => {
      expect(component.pageSizes).toEqual([3, 6, 10, 15]);
    });

    it('should inject services correctly', () => {
      expect(component.planningModelService).toBeDefined();
      expect(component.messageService).toBeDefined();
      expect(component.loaderService).toBeDefined();
    });
  });
});