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