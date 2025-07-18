import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { CompanyListPage } from './company-list.page';
import { CompanyService } from 'src/app/services/company.service';
import { MessageService } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GlobalService, UserRole } from 'src/app/services/global.service';
import { AdminService } from 'src/app/services/admin.service';
import { Company } from 'src/app/models/company';
import { ChangeDetectorRef } from '@angular/core';

import { 
  CompanyFactory, 
  createServiceSpy,
  createLoadingServiceSpy,
  createMessageServiceSpy,
  createChangeDetectorRefSpy,
  createMockEvent,
  createMockSortEvent,
} from '../../../test-fixtures';

describe('CompanyListPage', () => {
  let component: CompanyListPage;
  let fixture: ComponentFixture<CompanyListPage>;
  let mockCompanyService: jasmine.SpyObj<CompanyService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockAdminService: jasmine.SpyObj<AdminService>;

  const mockCompanies: Company[] = [
    CompanyFactory.create(),
    CompanyFactory.create({
      id: 2,
      name: 'Company B',
      subdomain: null,
      created_at: '2023-02-01',
      email: 'contact@company-b.com',
      theme_color: '#00ff00',
      phone: '0987654321'
    })
  ];

  beforeEach(() => {
    mockCompanyService = createServiceSpy('CompanyService');
    mockMessageService = createMessageServiceSpy();
    mockLoadingService = createLoadingServiceSpy();
    mockAdminService = createServiceSpy('AdminService');

    Object.defineProperty(mockAdminService, 'allAdmins', {
      value: [],
      writable: true
    });

    TestBed.configureTestingModule({
      declarations: [CompanyListPage],
      providers: [
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: GlobalService, useValue: { userRole: new BehaviorSubject(UserRole.SUPERADMIN) } },
        { provide: AdminService, useValue: mockAdminService },
        { provide: ChangeDetectorRef, useValue: createChangeDetectorRefSpy() }
      ]
    });

    fixture = TestBed.createComponent(CompanyListPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter()', () => {
    it('should load and filter companies with subdomain', async () => {
      mockCompanyService.get.and.returnValue(Promise.resolve(mockCompanies));

      await component.ionViewWillEnter();

      expect(mockCompanyService.get).toHaveBeenCalled();
      expect(component.dataSource.data.length).toBe(1);
      expect(component.dataSource.data[0].subdomain).toBe('company-a');
    });
  });

  describe('applyFilter()', () => {
    it('should filter data correctly', () => {
      const mockEvent = createMockEvent('  Company A  ');

      component.applyFilter(mockEvent);

      expect(component.dataSource.filter).toBe('company a');
    });
  });

  describe('Selection', () => {
    beforeEach(() => {
      component.dataSource.data = [mockCompanies[0]];
    });

    it('should detect all selected correctly', () => {
      component.selection.select(mockCompanies[0]);
      expect(component.isAllSelected()).toBe(true);
    });

    it('should toggle selection correctly', () => {
      component.masterToggle();
      expect(component.selection.selected.length).toBe(1);
      
      component.masterToggle();
      expect(component.selection.selected.length).toBe(0);
    });
  });

  describe('deleteSelected()', () => {
    beforeEach(() => {
      component.dataSource.data = [mockCompanies[0]];
    });

    it('should delete company successfully', () => {
      const deleteResponse = { message: 'Deleted' };
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(deleteResponse));
      mockCompanyService.delete.and.returnValue(of(deleteResponse) as any);

      component.deleteSelected(1);

      expect(mockCompanyService.delete).toHaveBeenCalledWith([1]);
      expect(component.dataSource.data.length).toBe(0);
      expect(mockMessageService.showToast).toHaveBeenCalledWith('Deleted', 'success');
    });

    it('should handle delete errors', () => {
      const error = 'Delete failed';
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(throwError(() => error));
      spyOn(console, 'error');

      component.deleteSelected(1);

      expect(mockMessageService.showToast).toHaveBeenCalledWith(error, 'danger');
    });
  });

  describe('sortData()', () => {
    beforeEach(() => {
      component.dataSource.data = [
        CompanyFactory.create({
          id: 2,
          name: 'Zebra',
          subdomain: 'zebra',
          created_at: '2023-02-01'
        }),
        CompanyFactory.create({
          id: 1,
          name: 'Alpha',
          subdomain: 'alpha',
          created_at: '2023-01-01'
        })
      ];
    });

    it('should sort by name ascending', () => {
      const sortEvent = createMockSortEvent('name', 'asc');
      
      component.sortData(sortEvent);
      
      expect(component.dataSource.data[0].name).toBe('Alpha');
      expect(component.dataSource.data[1].name).toBe('Zebra');
    });

    it('should not sort with empty direction', () => {
      const originalData = [...component.dataSource.data];
      const sortEvent = createMockSortEvent('name', '');
      
      component.sortData(sortEvent);
      
      expect(component.dataSource.data).toEqual(originalData);
    });
  });
});