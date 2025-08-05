import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyPage } from './company.page';
import { CompanyService } from 'src/app/services/company.service';
import { GlobalService, UserRole } from 'src/app/services/global.service';
import { MessageService, Message } from 'src/app/services/message.service';
import { Company } from 'src/app/models/company';
import { BehaviorSubject } from 'rxjs';

// 🌟 IMPORT DES FIXTURES
import { 
  CompanyFactory, 
  createServiceSpy,
  createMessageServiceSpy,
  createRouterSpy,
  createActivatedRouteSpy
} from '../../../test-fixtures/factories';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CompanyPage', () => {
  let component: CompanyPage;
  let fixture: ComponentFixture<CompanyPage>;
  let mockCompanyService: jasmine.SpyObj<CompanyService>;
  let mockGlobalService: any;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  //  au lieu de données hardcodées
  const mockCompany = CompanyFactory.create();

  beforeEach(() => {
    // HELPERS pour créer les spies
    mockCompanyService = createServiceSpy('CompanyService', ['getCompanyById', 'update', 'create', 'get']) as jasmine.SpyObj<CompanyService>;
    mockMessageService = createMessageServiceSpy();
    mockRouter = createRouterSpy();
    mockActivatedRoute = createActivatedRouteSpy();

    // Setup du GlobalService avec BehaviorSubject
    mockGlobalService = {
      userRole: new BehaviorSubject(UserRole.SUPERADMIN)
    };

    // Configuration des propriétés
    Object.defineProperty(mockCompanyService, 'companies', {
      value: [],
      writable: true
    });

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CompanyPage],
      providers: [
        FormBuilder,
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(CompanyPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();

    expect(component.companyForm).toBeDefined();
    expect(component.companyForm.get('name')).toBeDefined();
    expect(component.companyForm.get('email')).toBeDefined();
    expect(component.companyForm.get('subdomain')).toBeDefined();
    expect(component.companyForm.get('theme_color')).toBeDefined();
    expect(component.companyForm.get('phone')).toBeDefined();
  });

  it('should load existing company when companyId is provided', () => {
    component.companyId = mockCompany.id;
    mockCompanyService.getCompanyById.and.returnValue(mockCompany);
    
    component.ngOnInit();

    expect(mockCompanyService.getCompanyById).toHaveBeenCalledWith(mockCompany.id);
    expect(component.companySelected).toBe(mockCompany);
    expect(component.companyForm.get('name')?.value).toBe(mockCompany.name);
  });

  it('should validate form fields correctly', () => {
    component.ngOnInit();

    // Test required fields
    expect(component.companyForm.valid).toBe(false);

    // Factory pour données de test
    const validCompanyData = CompanyFactory.create();

    component.companyForm.patchValue(validCompanyData);
    expect(component.companyForm.valid).toBe(true);
  });

  it('should call create service when submitting new company', async () => {
    component.ngOnInit();
    component.companySelected = null;
    mockCompanyService.create.and.returnValue(Promise.resolve(mockCompany));

    const { id, created_at, ...newCompanyData } = CompanyFactory.create({
      name: 'New Company',
      email: 'new@company.com',
      subdomain: 'new',
      theme_color: '#ff0000',
      phone: '0123456789'
    });

    component.companyForm.patchValue(newCompanyData);

    await component.onSubmit();

    expect(mockCompanyService.create).toHaveBeenCalledWith(newCompanyData);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/company-list']);
  });

  it('should call update service when submitting existing company', async () => {
    component.ngOnInit();
    component.companySelected = mockCompany;
    component.companyId = mockCompany.id;
    mockCompanyService.update.and.returnValue(Promise.resolve(mockCompany));
    
    // 🔥 UTILISATION: Factory pour données de mise à jour
    const updatedCompanyData = CompanyFactory.create();

    component.companyForm.patchValue(updatedCompanyData);

    await component.onSubmit();

    expect(mockCompanyService.update).toHaveBeenCalledWith({
      id: mockCompany.id,
      ...updatedCompanyData
    });
  });

  it('should handle different navigation based on user role', async () => {
    component.ngOnInit();
    component.companySelected = mockCompany;
    component.companyId = mockCompany.id;
    mockCompanyService.update.and.returnValue(Promise.resolve(mockCompany));
    
    const testCompanyData = CompanyFactory.create();

    component.companyForm.patchValue(testCompanyData);

    // Test SUPERADMIN navigation
    mockGlobalService.userRole.next(UserRole.SUPERADMIN);
    await component.onSubmit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/company-list']);

    // Reset router spy
    mockRouter.navigate.calls.reset();

    // Test ADMIN stays on page
    mockGlobalService.userRole.next(UserRole.ADMIN);
    await component.onSubmit();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(mockCompanyService.get).toHaveBeenCalled();
  });

  it('should clear messages when leaving view', () => {
    component.ionViewWillLeave();

    expect(mockMessageService.clearMessage).toHaveBeenCalled();
  });
});