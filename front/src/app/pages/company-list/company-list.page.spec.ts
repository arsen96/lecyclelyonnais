import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { CompanyListPage } from './company-list.page';
import { CompanyService } from 'src/app/services/company.service';
import { MessageService } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GlobalService, UserRole } from 'src/app/services/global.service';
import { AdminService } from 'src/app/services/admin.service';
import { Company } from 'src/app/models/company';
import { ChangeDetectorRef } from '@angular/core';

describe('CompanyListPage', () => {
  let component: CompanyListPage;
  let fixture: ComponentFixture<CompanyListPage>;
  let mockCompanyService: jasmine.SpyObj<CompanyService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockAdminService: jasmine.SpyObj<AdminService>;

  const mockCompanies: Company[] = [
    {
      id: 1,
      name: 'Company A',
      subdomain: 'company-a',
      created_at: '2023-01-01',
      email: 'contact@company-a.com',
      theme_color: '#ff0000',
      phone: '0123456789'
    },
    {
      id: 2,
      name: 'Company B',
      subdomain: null, // Cette entreprise sera filtrée
      created_at: '2023-02-01',
      email: 'contact@company-b.com',
      theme_color: '#00ff00',
      phone: '0987654321'
    }
  ];

  beforeEach(() => {
    const companyServiceSpy = jasmine.createSpyObj('CompanyService', ['get', 'delete']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['showToast']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['setLoading', 'showLoaderUntilCompleted']);
    const adminServiceSpy = jasmine.createSpyObj('AdminService', [], {
      allAdmins: []
    });

    TestBed.configureTestingModule({
      declarations: [CompanyListPage],
      providers: [
        { provide: CompanyService, useValue: companyServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: GlobalService, useValue: { userRole: new BehaviorSubject(UserRole.SUPERADMIN) } },
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: ChangeDetectorRef, useValue: jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']) }
      ]
    });

    fixture = TestBed.createComponent(CompanyListPage);
    component = fixture.componentInstance;
    
    mockCompanyService = TestBed.inject(CompanyService) as jasmine.SpyObj<CompanyService>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    mockLoadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    mockAdminService = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
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
      const mockEvent = { target: { value: '  Company A  ' } } as any;

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
        { id: 2, name: 'Zebra', subdomain: 'zebra', created_at: '2023-02-01' },
        { id: 1, name: 'Alpha', subdomain: 'alpha', created_at: '2023-01-01' }
      ] as Company[];
    });

    it('should sort by name ascending', () => {
      component.sortData({ active: 'name', direction: 'asc' });
      
      expect(component.dataSource.data[0].name).toBe('Alpha');
      expect(component.dataSource.data[1].name).toBe('Zebra');
    });

    it('should not sort with empty direction', () => {
      const originalData = [...component.dataSource.data];
      
      component.sortData({ active: 'name', direction: '' });
      
      expect(component.dataSource.data).toEqual(originalData);
    });
  });
});