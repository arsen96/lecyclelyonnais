import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';

import { UsersListPage } from './users-list.page';
import { ClientService } from 'src/app/services/client.service';
import { MessageService } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';

describe('UsersListPage', () => {
  let component: UsersListPage;
  let fixture: ComponentFixture<UsersListPage>;
  let mockClientService: jasmine.SpyObj<ClientService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  const mockUsers = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '0123456789',
      address: '123 Main St'
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      phone: '0987654321',
      address: '456 Oak Ave'
    }
  ];

  beforeEach(() => {
    const clientServiceSpy = jasmine.createSpyObj('ClientService', ['get', 'create'], {
      allClients: mockUsers
    });
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['showToast']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['setLoading', 'showLoaderUntilCompleted']);
    const changeDetectorRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    TestBed.configureTestingModule({
      declarations: [UsersListPage],
      providers: [
        { provide: ClientService, useValue: clientServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefSpy }
      ]
    });

    fixture = TestBed.createComponent(UsersListPage);
    component = fixture.componentInstance;
    
    mockClientService = TestBed.inject(ClientService) as jasmine.SpyObj<ClientService>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    mockLoadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter()', () => {
    it('should load users and populate dataSource', async () => {
      mockClientService.get.and.returnValue(Promise.resolve(true));

      await component.ionViewWillEnter();

      expect(mockLoadingService.setLoading).toHaveBeenCalledWith(true);
      expect(mockClientService.get).toHaveBeenCalled();
      expect(component.dataSource.data).toEqual(mockUsers);
      expect(mockLoadingService.setLoading).toHaveBeenCalledWith(false);
    });

    it('should resolve usersLoaded promise', async () => {
      mockClientService.get.and.returnValue(Promise.resolve(true));
      spyOn(component, 'usersLoadedResolver');

      await component.ionViewWillEnter();

      expect(component.usersLoadedResolver).toHaveBeenCalledWith(true);
    });
  });

  describe('ngAfterViewInit()', () => {
    it('should set paginator after users are loaded', async () => {
      // Simuler que les utilisateurs sont déjà chargés
      component.usersLoadedResolver(true);

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
  });

  describe('Selection methods', () => {
    beforeEach(() => {
      component.dataSource.data = mockUsers;
    });

    describe('isAllSelected()', () => {
      it('should return true when all items are selected', () => {
        component.selection.select(...mockUsers);

        const result = component.isAllSelected();

        expect(result).toBe(true);
      });

      it('should return false when not all items are selected', () => {
        component.selection.select(mockUsers[0]);

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

        expect(component.selection.selected.length).toBe(mockUsers.length);
        expect(component.selection.isSelected(mockUsers[0])).toBe(true);
        expect(component.selection.isSelected(mockUsers[1])).toBe(true);
      });

      it('should clear selection when all items are selected', () => {
        component.selection.select(...mockUsers);

        component.masterToggle();

        expect(component.selection.selected.length).toBe(0);
      });

      it('should select all when some items are selected', () => {
        component.selection.select(mockUsers[0]);

        component.masterToggle();

        expect(component.selection.selected.length).toBe(mockUsers.length);
      });
    });
  });

  describe('deleteSelected()', () => {
    beforeEach(() => {
      component.dataSource.data = [...mockUsers];
    });

    it('should delete single user by elementId', () => {
      const deleteResponse = { message: 'User deleted successfully' };
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(deleteResponse));
      mockClientService.create.and.returnValue(of(deleteResponse));

      component.deleteSelected(1);

      expect(mockClientService.create).toHaveBeenCalledWith([1]);
      expect(component.dataSource.data.length).toBe(1);
      expect(component.dataSource.data.find(u => u.id === 1)).toBeUndefined();
      expect(mockMessageService.showToast).toHaveBeenCalledWith('User deleted successfully', 'success');
    });

    it('should delete multiple selected users', () => {
      const deleteResponse = { message: 'Users deleted successfully' };
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(deleteResponse));
      mockClientService.create.and.returnValue(of(deleteResponse));
      component.selection.select(mockUsers[0], mockUsers[1]);

      component.deleteSelected();

      expect(mockClientService.create).toHaveBeenCalledWith([1, 2]);
      expect(component.dataSource.data.length).toBe(0);
      expect(component.selection.selected.length).toBe(0);
      expect(mockMessageService.showToast).toHaveBeenCalledWith('Users deleted successfully', 'success');
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
      mockClientService.create.and.returnValue(of(deleteResponse));
      spyOn(console, 'log');

      component.deleteSelected(1);

      expect(console.log).toHaveBeenCalledWith('Deleting items with IDs:', [1]);
    });
  });

  describe('sortData()', () => {
    beforeEach(() => {
      component.dataSource.data = [
        { id: 2, first_name: 'Zebra', last_name: 'Last', email: 'z@test.com' },
        { id: 1, first_name: 'Alpha', last_name: 'First', email: 'a@test.com' }
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

    it('should sort by email ascending', () => {
      component.sortData({ active: 'email', direction: 'asc' });

      expect(component.dataSource.data[0].email).toBe('a@test.com');
      expect(component.dataSource.data[1].email).toBe('z@test.com');
    });

    it('should sort by id ascending', () => {
      component.sortData({ active: 'id', direction: 'asc' });

      expect(component.dataSource.data[0].id).toBe(1);
      expect(component.dataSource.data[1].id).toBe(2);
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

      // Les données ne devraient pas changer pour un champ inconnu
      expect(component.dataSource.data).toEqual(originalData);
    });
  });

  describe('Component initialization', () => {
    it('should initialize displayedColumns correctly', () => {
      expect(component.displayedColumns).toEqual([
        'select', 'id', 'last_name', 'first_name', 'email', 'actions'
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

    it('should create usersLoaded promise', () => {
      expect(component.usersLoaded).toBeInstanceOf(Promise);
      expect(component.usersLoadedResolver).toBeInstanceOf(Function);
    });
  });
});