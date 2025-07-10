import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

import { BikesListPage } from './bikes-list.page';
import { BicycleService } from 'src/app/services/bicycle.service';
import { MessageService } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';

import { 
  BicycleFactory, 
  createServiceSpy,
  createLoadingServiceSpy,
  createMessageServiceSpy,
  TEST_CONSTANTS
} from '../../../../test-fixtures';

describe('BikesListPage', () => {
  let component: BikesListPage;
  let fixture: ComponentFixture<BikesListPage>;
  let mockBicycleService: jasmine.SpyObj<BicycleService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  // 🔥 REMPLACEMENT: Factory au lieu de données hardcodées
  const mockBikes = BicycleFactory.createMultiple(2);

  beforeEach(() => {
    // 🌟 UTILISATION: Helpers pour créer les spies
    mockBicycleService = createServiceSpy('BicycleService', ['getUserBicycles', 'delete']) as jasmine.SpyObj<BicycleService>;
    mockMessageService = createMessageServiceSpy();
    mockLoadingService = createLoadingServiceSpy();

    TestBed.configureTestingModule({
      declarations: [BikesListPage],
      providers: [
        { provide: BicycleService, useValue: mockBicycleService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: ChangeDetectorRef, useValue: jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']) }
      ]
    });

    fixture = TestBed.createComponent(BikesListPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should initialize data structures correctly', () => {
      expect(component.dataSource).toBeInstanceOf(MatTableDataSource);
      expect(component.selection).toBeInstanceOf(SelectionModel);
      expect(component.selection.isMultipleSelection()).toBe(true);
      
      // 🔧 CORRECTION: Ordre des colonnes selon le code réel
      expect(component.displayedColumns).toEqual(['select', 'id', 'model', 'brand', 'actions']);
      expect(component.pageSizes).toEqual(TEST_CONSTANTS.PAGINATION.PAGE_SIZES);
    });
  });

  describe('Data loading', () => {
    it('should load bikes successfully', () => {
      mockBicycleService.getUserBicycles.and.returnValue(of(mockBikes));

      component.ionViewWillEnter();

      expect(mockLoadingService.setLoading).toHaveBeenCalledWith(true);
      expect(mockBicycleService.getUserBicycles).toHaveBeenCalled();
      expect(component.dataSource.data).toEqual(mockBikes);
      expect(mockLoadingService.setLoading).toHaveBeenCalledWith(false);
    });

  });

  describe('Selection management', () => {
    beforeEach(() => {
      component.dataSource.data = mockBikes;
    });

    it('should handle master toggle', () => {
      component.masterToggle();
      expect(component.selection.selected.length).toBe(mockBikes.length);

      component.masterToggle();
      expect(component.selection.selected.length).toBe(0);
    });

    it('should check if all selected', () => {
      expect(component.isAllSelected()).toBe(false);
      
      component.selection.select(...mockBikes);
      expect(component.isAllSelected()).toBe(true);
    });
  });

  describe('Delete operations', () => {
    beforeEach(() => {
      component.dataSource.data = [...mockBikes];
    });

    it('should delete single bike', () => {
      // 🔧 CORRECTION: Le message vient de response.message, pas hardcodé
      const deleteResponse = { message: 'Bike deleted successfully' };
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(deleteResponse));
      mockBicycleService.delete.and.returnValue(of(deleteResponse));

      component.deleteSelected(mockBikes[0].id);

      expect(mockBicycleService.delete).toHaveBeenCalledWith([mockBikes[0].id]);
      // 🔧 CORRECTION: Vérifier que l'élément avec cet ID est supprimé
      expect(component.dataSource.data.find(bike => bike.id === mockBikes[0].id)).toBeUndefined();
      expect(mockMessageService.showToast).toHaveBeenCalledWith('Bike deleted successfully', 'success');
    });

    it('should delete multiple selected bikes', () => {
      // 🔧 CORRECTION: Message personnalisé pour multiple
      const deleteResponse = { message: 'Bikes deleted successfully' };
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(deleteResponse));
      mockBicycleService.delete.and.returnValue(of(deleteResponse));
      component.selection.select(...mockBikes);

      component.deleteSelected();

      expect(mockBicycleService.delete).toHaveBeenCalledWith([mockBikes[0].id, mockBikes[1].id]);
      expect(component.dataSource.data.length).toBe(0);
      expect(component.selection.selected.length).toBe(0);
      expect(mockMessageService.showToast).toHaveBeenCalledWith('Bikes deleted successfully', 'success');
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
      mockBicycleService.delete.and.returnValue(of(deleteResponse));
      spyOn(console, 'log');

      component.deleteSelected(1);

      expect(console.log).toHaveBeenCalledWith('Deleting items with IDs:', [1]);
    });
  });

  describe('Sorting', () => {
    beforeEach(() => {
      component.dataSource.data = [
        BicycleFactory.create({ brand: 'Zebra', model: 'Z1' }),
        BicycleFactory.create({ brand: 'Alpha', model: 'A1' })
      ];
    });

    it('should sort by brand ascending', () => {
      component.sortData({ active: 'brand', direction: 'asc' });

      expect(component.dataSource.data[0].brand).toBe('Alpha');
      expect(component.dataSource.data[1].brand).toBe('Zebra');
    });

    it('should sort by brand descending', () => {
      component.sortData({ active: 'brand', direction: 'desc' });

      expect(component.dataSource.data[0].brand).toBe('Zebra');
      expect(component.dataSource.data[1].brand).toBe('Alpha');
    });

    it('should return original data when direction is empty', () => {
      const originalData = [...component.dataSource.data];
      
      component.sortData({ active: 'brand', direction: '' });

      expect(component.dataSource.data).toEqual(originalData);
    });

    it('should sort by model ascending', () => {
      component.sortData({ active: 'model', direction: 'asc' });

      expect(component.dataSource.data[0].model).toBe('A1');
      expect(component.dataSource.data[1].model).toBe('Z1');
    });

    it('should sort by id ascending', () => {
      const data = [
        BicycleFactory.create({ id: 3 }),
        BicycleFactory.create({ id: 1 })
      ];
      component.dataSource.data = data;

      component.sortData({ active: 'id', direction: 'asc' });

      expect(component.dataSource.data[0].id).toBe(1);
      expect(component.dataSource.data[1].id).toBe(3);
    });
  });

  describe('Filtering', () => {
    beforeEach(() => {
      component.dataSource.data = [
        BicycleFactory.create({ brand: 'Trek', model: 'Domane' }),
        BicycleFactory.create({ brand: 'Giant', model: 'Escape' })
      ];
    });

    it('should filter bikes by search term', () => {
      component.applyFilter({ target: { value: 'Trek' } } as any);

      expect(component.dataSource.filter).toBe('trek');
    });

    it('should reset filter when search is empty', () => {
      component.applyFilter({ target: { value: '' } } as any);

      expect(component.dataSource.filter).toBe('');
    });

    it('should trim and lowercase filter value', () => {
      component.applyFilter({ target: { value: '  TREK  ' } } as any);

      expect(component.dataSource.filter).toBe('trek');
    });
  });

  describe('Lifecycle methods', () => {
    it('should have ngOnInit defined but empty', () => {
      expect(component.ngOnInit).toBeDefined();
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should resolve bikes loaded promise', (done) => {
      mockBicycleService.getUserBicycles.and.returnValue(of(mockBikes));

      component.bikesLoaded.then((result) => {
        expect(result).toBe(true);
        done();
      });

      component.ionViewWillEnter();
    });
  });

  describe('Checkbox functionality', () => {
    beforeEach(() => {
      component.dataSource.data = mockBikes;
    });

    it('should handle individual selection', () => {
      const bike = mockBikes[0];
      
      component.selection.select(bike);
      
      expect(component.selection.isSelected(bike)).toBe(true);
      expect(component.selection.selected.length).toBe(1);
    });

    it('should deselect all when clearing', () => {
      component.selection.select(...mockBikes);
      expect(component.selection.selected.length).toBe(mockBikes.length);
      
      component.selection.clear();
      
      expect(component.selection.selected.length).toBe(0);
    });
  });
});