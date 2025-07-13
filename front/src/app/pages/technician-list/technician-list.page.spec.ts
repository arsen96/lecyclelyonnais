import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { of, throwError } from 'rxjs';

import { TechnicianListPage } from './technician-list.page';
import { TechnicianService } from 'src/app/services/technician.service';
import { MessageService } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';

describe('TechnicianListPage', () => {
  let component: TechnicianListPage;
  let fixture: ComponentFixture<TechnicianListPage>;
  let mockTechnicianService: jasmine.SpyObj<TechnicianService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  const mockTechnicians = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '0123456789',
      address: '123 Main St',
      created_at: '2023-01-01',
      is_available: true,
      geographical_zone_id: 1
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      phone: '0987654321',
      address: '456 Oak Ave',
      created_at: '2023-02-01',
      is_available: true,
      geographical_zone_id: 2
    }
  ];

  beforeEach(() => {
    const technicianServiceSpy = jasmine.createSpyObj('TechnicianService', ['get', 'delete']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['showToast']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['setLoading', 'showLoaderUntilCompleted']);

    TestBed.configureTestingModule({
      declarations: [TechnicianListPage],
      providers: [
        { provide: TechnicianService, useValue: technicianServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(TechnicianListPage);
    component = fixture.componentInstance;
    
    mockTechnicianService = TestBed.inject(TechnicianService) as jasmine.SpyObj<TechnicianService>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    mockLoadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter()', () => {
    it('should load technicians and populate dataSource', async () => {
      mockTechnicianService.get.and.returnValue(Promise.resolve(mockTechnicians));

      await component.ionViewWillEnter();

      expect(mockLoadingService.setLoading).toHaveBeenCalledWith(true);
      expect(mockTechnicianService.get).toHaveBeenCalled();
      expect(component.dataSource.data).toEqual(mockTechnicians);
      expect(mockLoadingService.setLoading).toHaveBeenCalledWith(false);
    });

    it('should resolve techniciansLoaded promise', async () => {
      mockTechnicianService.get.and.returnValue(Promise.resolve(mockTechnicians));
      spyOn(component, 'techniciansLoadedResolver');

      await component.ionViewWillEnter();

      expect(component.techniciansLoadedResolver).toHaveBeenCalledWith(true);
    });

    it('should handle service errors', async () => {
      const error = 'Service error';
      mockTechnicianService.get.and.returnValue(Promise.reject(error));
      spyOn(console, 'error');

      try {
        await component.ionViewWillEnter();
      } catch (e) {
        console.error('Error loading technicians:', error);
        expect(mockLoadingService.setLoading).toHaveBeenCalledWith(false);
      }
    });
  });

  describe('ngAfterViewInit()', () => {
    it('should set paginator after technicians are loaded', async () => {
      // Simuler que les techniciens sont déjà chargés
      component.techniciansLoadedResolver(true);

      await component.ngAfterViewInit();

      expect(component.dataSource.paginator).toBe(component.paginator);
    });
  });

  describe('applyFilter()', () => {
    it('should filter dataSource correctly', () => {
      const mockEvent = { target: { value: '  John Doe  ' } } as any;

      component.applyFilter(mockEvent);

      expect(component.dataSource.filter).toBe('john doe');
    });

    it('should handle empty filter', () => {
      const mockEvent = { target: { value: '' } } as any;

      component.applyFilter(mockEvent);

      expect(component.dataSource.filter).toBe('');
    });

    it('should trim whitespace from filter', () => {
      const mockEvent = { target: { value: '   Jane   ' } } as any;

      component.applyFilter(mockEvent);

      expect(component.dataSource.filter).toBe('jane');
    });
  });

  describe('Selection methods', () => {
    beforeEach(() => {
      component.dataSource.data = mockTechnicians;
    });

    describe('isAllSelected()', () => {
      it('should return true when all items are selected', () => {
        component.selection.select(...mockTechnicians);

        const result = component.isAllSelected();

        expect(result).toBe(true);
      });

      it('should return false when not all items are selected', () => {
        component.selection.select(mockTechnicians[0]);

        const result = component.isAllSelected();

        expect(result).toBe(false);
      });

      it('should return false when no items are selected', () => {
        const result = component.isAllSelected();

        expect(result).toBe(false);
      });

    });

    describe('masterToggle()', () => {
      it('should select all items when none are selected', () => {
        component.masterToggle();

        expect(component.selection.selected.length).toBe(mockTechnicians.length);
        expect(component.selection.isSelected(mockTechnicians[0])).toBe(true);
        expect(component.selection.isSelected(mockTechnicians[1])).toBe(true);
      });

      it('should clear selection when all items are selected', () => {
        component.selection.select(...mockTechnicians);

        component.masterToggle();

        expect(component.selection.selected.length).toBe(0);
      });

      it('should select all when some items are selected', () => {
        component.selection.select(mockTechnicians[0]);

        component.masterToggle();

        expect(component.selection.selected.length).toBe(mockTechnicians.length);
      });
      
    });
  });

  describe('deleteSelected()', () => {
    beforeEach(() => {
      component.dataSource.data = [...mockTechnicians];
    });

    it('should delete single technician by elementId', () => {
      const deleteResponse = { message: 'Technician deleted successfully' };
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(deleteResponse));
      mockTechnicianService.delete.and.returnValue(of(deleteResponse as any));

      component.deleteSelected(1);

      expect(mockTechnicianService.delete).toHaveBeenCalledWith([1]);
      expect(component.dataSource.data.length).toBe(1);
      expect(component.dataSource.data.find(t => t.id === 1)).toBeUndefined();
      expect(component.selection.selected.length).toBe(0);
      expect(mockMessageService.showToast).toHaveBeenCalledWith('Technician deleted successfully', 'success');
    });

    it('should delete multiple selected technicians', () => {
      const deleteResponse = { message: 'Technicians deleted successfully' };
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(deleteResponse));
      mockTechnicianService.delete.and.returnValue(of(deleteResponse as any));
      component.selection.select(mockTechnicians[0], mockTechnicians[1]);

      component.deleteSelected();

      expect(mockTechnicianService.delete).toHaveBeenCalledWith([1, 2]);
      expect(component.dataSource.data.length).toBe(0);
      expect(component.selection.selected.length).toBe(0);
      expect(mockMessageService.showToast).toHaveBeenCalledWith('Technicians deleted successfully', 'success');
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
      mockTechnicianService.delete.and.returnValue(of(deleteResponse as any));
      spyOn(console, 'log');

      component.deleteSelected(1);

      expect(console.log).toHaveBeenCalledWith('Deleting items with IDs:', [1]);
    });

    it('should delete selected items when no elementId provided', () => {
      const deleteResponse = { message: 'Selected technicians deleted' };
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(deleteResponse));
      mockTechnicianService.delete.and.returnValue(of(deleteResponse as any));
      component.selection.select(mockTechnicians[0]);

      component.deleteSelected();

      expect(mockTechnicianService.delete).toHaveBeenCalledWith([1]);
      expect(component.dataSource.data.length).toBe(1);
      expect(component.dataSource.data[0].id).toBe(2);
    });
  });

  describe('sortData()', () => {
    beforeEach(() => {
      component.dataSource.data = [
        { id: 2, first_name: 'Zebra', last_name: 'Last', created_at: '2023-02-01' },
        { id: 1, first_name: 'Alpha', last_name: 'First', created_at: '2023-01-01' }
      ] as any[];
    });

    it('should sort by first_name ascending', () => {
      component.sortData({ active: 'first_name', direction: 'asc' });

      expect(component.dataSource.data[0].first_name).toBe('Alpha');
      expect(component.dataSource.data[1].first_name).toBe('Zebra');
    });

    it('should sort by first_name descending', () => {
      component.sortData({ active: 'first_name', direction: 'desc' });

      expect(component.dataSource.data[0].first_name).toBe('Zebra');
      expect(component.dataSource.data[1].first_name).toBe('Alpha');
    });

    it('should sort by last_name ascending', () => {
      component.sortData({ active: 'last_name', direction: 'asc' });

      expect(component.dataSource.data[0].last_name).toBe('First');
      expect(component.dataSource.data[1].last_name).toBe('Last');
    });

    it('should sort by last_name descending', () => {
      component.sortData({ active: 'last_name', direction: 'desc' });

      expect(component.dataSource.data[0].last_name).toBe('Last');
      expect(component.dataSource.data[1].last_name).toBe('First');
    });

    it('should sort by created_at ascending', () => {
      component.sortData({ active: 'created_at', direction: 'asc' });

      expect(component.dataSource.data[0].created_at).toBe('2023-01-01');
      expect(component.dataSource.data[1].created_at).toBe('2023-02-01');
    });

    it('should sort by created_at descending', () => {
      component.sortData({ active: 'created_at', direction: 'desc' });

      expect(component.dataSource.data[0].created_at).toBe('2023-02-01');
      expect(component.dataSource.data[1].created_at).toBe('2023-01-01');
    });

    it('should sort by id ascending', () => {
      component.sortData({ active: 'id', direction: 'asc' });

      expect(component.dataSource.data[0].id).toBe(1);
      expect(component.dataSource.data[1].id).toBe(2);
    });

    it('should sort by id descending', () => {
      component.sortData({ active: 'id', direction: 'desc' });

      expect(component.dataSource.data[0].id).toBe(2);
      expect(component.dataSource.data[1].id).toBe(1);
    });

    it('should not sort when direction is empty', () => {
      const originalData = [...component.dataSource.data];

      component.sortData({ active: 'first_name', direction: '' });

      expect(component.dataSource.data).toEqual(originalData);
    });

    it('should not sort when active is empty', () => {
      const originalData = [...component.dataSource.data];

      component.sortData({ active: '', direction: 'asc' });

      expect(component.dataSource.data).toEqual(originalData);
    });

    it('should handle default case for unknown sort field', () => {
      const originalData = [...component.dataSource.data];

      component.sortData({ active: 'unknown_field', direction: 'asc' });

      expect(component.dataSource.data).toEqual(originalData);
    });
  });

  describe('Component initialization', () => {
    it('should initialize displayedColumns correctly', () => {
      expect(component.displayedColumns).toEqual([
        'select', 'id', 'last_name', 'first_name', 'created_at', 'actions'
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

    it('should create techniciansLoaded promise', () => {
      expect(component.techniciansLoaded).toBeInstanceOf(Promise);
      expect(component.techniciansLoadedResolver).toBeInstanceOf(Function);
    });

    it('should inject TechnicianService correctly', () => {
      expect(component.technicianService).toBeDefined();
    });
  });

  describe('ngOnInit()', () => {
    it('should be defined but empty (no implementation)', () => {
      expect(component.ngOnInit).toBeDefined();
      
      // Appeler ngOnInit ne devrait rien faire de spécial
      expect(() => component.ngOnInit()).not.toThrow();
    });
  });
});