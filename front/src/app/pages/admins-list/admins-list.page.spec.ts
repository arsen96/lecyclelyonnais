import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { of, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { AdminsListPage } from './admins-list.page';
import { AdminService } from 'src/app/services/admin.service';
import { MessageService } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GlobalService, UserRole } from 'src/app/services/global.service';
import { CompanyService } from 'src/app/services/company.service';
import { NO_ERRORS_SCHEMA} from '@angular/core';
import { 
  AdminFactory, 
  CompanyFactory,
  createServiceSpy,
  createMessageServiceSpy,
  createLoadingServiceSpy,
  TEST_CONSTANTS,
} from '../../../test-fixtures/factories';

describe('AdminsListPage', () => {
  let component: AdminsListPage;
  let fixture: ComponentFixture<AdminsListPage>;
  let mockAdminService: jasmine.SpyObj<AdminService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockGlobalService: any;
  let mockCompanyService: any;

  // 🔥 FACTORIES au lieu de données hardcodées
  const mockAdmins = [
    AdminFactory.create({ id: 1, company_id: 1 }),
    AdminFactory.create({ id: 2, company_id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' })
  ];

  const mockCompanies = CompanyFactory.createMultiple(2);

  beforeEach(() => {
    // 🌟 HELPERS pour créer les spies
    mockAdminService = createServiceSpy('AdminService', ['get', 'delete']) as jasmine.SpyObj<AdminService>;
    mockMessageService = createMessageServiceSpy();
    mockLoadingService = createLoadingServiceSpy();

    // Setup des propriétés
    Object.defineProperty(mockAdminService, 'allAdmins', {
      value: mockAdmins,
      writable: true
    });

    mockGlobalService = {
      userRole: new BehaviorSubject(UserRole.SUPERADMIN)
    };

    mockCompanyService = {
      currentCompany: { id: 1 },
      getCompanyById: jasmine.createSpy('getCompanyById').and.callFake((id: number) => {
        return mockCompanies.find(c => c.id === id);
      })
    };

    TestBed.configureTestingModule({
      declarations: [AdminsListPage],
      providers: [
        { provide: AdminService, useValue: mockAdminService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: CompanyService, useValue: mockCompanyService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(AdminsListPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Data loading', () => {
    it('should load all admins for SUPERADMIN', async () => {
      mockGlobalService.userRole.next(UserRole.SUPERADMIN);
      mockAdminService.get.and.returnValue(Promise.resolve(mockAdmins as any));

      await component.ionViewWillEnter();

      expect(mockLoadingService.setLoading).toHaveBeenCalledWith(true);
      expect(mockAdminService.get).toHaveBeenCalled();
      expect(component.dataSource.data.length).toBe(2);
      expect(mockLoadingService.setLoading).toHaveBeenCalledWith(false);
    });

    it('should filter admins by company for ADMIN role', async () => {
      mockGlobalService.userRole.next(UserRole.ADMIN);
      mockAdminService.get.and.returnValue(Promise.resolve(mockAdmins as any));

      await component.ionViewWillEnter();

      expect(mockAdminService.get).toHaveBeenCalled();
      expect(component.dataSource.data.length).toBe(1);
      expect(component.dataSource.data[0].company_id).toBe(mockCompanyService.currentCompany.id);
    });

    it('should map company names correctly', async () => {
      mockAdminService.get.and.returnValue(Promise.resolve(mockAdmins as any));

      await component.ionViewWillEnter();

      expect(mockCompanyService.getCompanyById).toHaveBeenCalledWith(1);
      expect(mockCompanyService.getCompanyById).toHaveBeenCalledWith(2);
      expect(component.dataSource.data[0].company_name).toBeDefined();
      expect(component.dataSource.data[1].company_name).toBeDefined();
    });

    it('should resolve adminsLoaded promise', async () => {
      mockAdminService.get.and.returnValue(Promise.resolve(mockAdmins as any));
      spyOn(component, 'adminsLoadedResolver');

      await component.ionViewWillEnter();

      expect(component.adminsLoadedResolver).toHaveBeenCalledWith(true);
    });
  });

 

  describe('Filtering', () => {
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

  describe('Selection management', () => {
    beforeEach(() => {
      component.dataSource.data = mockAdmins;
    });

    it('should handle master toggle correctly', () => {
      // Select all
      component.masterToggle();
      expect(component.selection.selected.length).toBe(mockAdmins.length);

      // Deselect all
      component.masterToggle();
      expect(component.selection.selected.length).toBe(0);
    });

    it('should check if all selected correctly', () => {
      expect(component.isAllSelected()).toBe(false);
      
      component.selection.select(...mockAdmins);
      expect(component.isAllSelected()).toBe(true);
    });

    it('should handle partial selection', () => {
      component.selection.select(mockAdmins[0]);
      
      expect(component.isAllSelected()).toBe(false);
      
      component.masterToggle();
      expect(component.selection.selected.length).toBe(mockAdmins.length);
    });
  });

  describe('Delete operations', () => {
    beforeEach(() => {
      component.dataSource.data = [...mockAdmins];
    });

    it('should delete single admin by elementId', () => {
      const deleteResponse = { message: 'Admin deleted successfully' };
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(deleteResponse));
      mockAdminService.delete.and.returnValue(of(deleteResponse as any));

      component.deleteSelected(1);

      expect(mockAdminService.delete).toHaveBeenCalledWith([1]);
      expect(component.dataSource.data.find(a => a.id === 1)).toBeUndefined();
      expect(component.selection.selected.length).toBe(0);
      expect(mockMessageService.showToast).toHaveBeenCalledWith('Admin deleted successfully', 'success');
    });

    it('should delete multiple selected admins', () => {
      const deleteResponse = { message: 'Admins deleted successfully' };
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(deleteResponse));
      mockAdminService.delete.and.returnValue(of(deleteResponse as any));
      component.selection.select(...mockAdmins);

      component.deleteSelected();

      expect(mockAdminService.delete).toHaveBeenCalledWith([1, 2]);
      expect(component.dataSource.data.length).toBe(0);
      expect(component.selection.selected.length).toBe(0);
      expect(mockMessageService.showToast).toHaveBeenCalledWith('Admins deleted successfully', 'success');
    });

    it('should handle delete errors', () => {
      const errorMessage = 'Delete failed';
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(throwError(() => errorMessage));
      spyOn(console, 'error');

      component.deleteSelected(1);

      expect(console.error).toHaveBeenCalledWith('Delete error:', errorMessage);
      expect(mockMessageService.showToast).toHaveBeenCalledWith(errorMessage, 'danger');
    });
  });

});