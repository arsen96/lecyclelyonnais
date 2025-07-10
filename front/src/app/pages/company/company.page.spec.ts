import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyPage } from './company.page';
import { CompanyService } from 'src/app/services/company.service';
import { GlobalService, UserRole } from 'src/app/services/global.service';
import { MessageService, Message } from 'src/app/services/message.service';
import { Company } from 'src/app/models/company';
import { BehaviorSubject } from 'rxjs';

describe('CompanyPage', () => {
  let component: CompanyPage;
  let fixture: ComponentFixture<CompanyPage>;
  let mockCompanyService: jasmine.SpyObj<CompanyService>;
  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  const mockCompany: Company = {
    id: 1,
    name: 'Test Company',
    email: 'test@company.com',
    subdomain: 'test',
    theme_color: '#ff0000',
    phone: '0123456789',
  };

  beforeEach(() => {
    const companyServiceSpy = jasmine.createSpyObj('CompanyService', [
      'getCompanyById', 'update', 'create', 'get'
    ], {
      companies: []
    });

    const globalServiceSpy = jasmine.createSpyObj('GlobalService', [], {
      userRole: new BehaviorSubject(UserRole.SUPERADMIN)
    });

    const messageServiceSpy = jasmine.createSpyObj('MessageService', [
      'showMessage', 'clearMessage'
    ]);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    mockActivatedRoute = {
      snapshot: {
        params: { id: null }
      }
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CompanyPage],
      providers: [
        FormBuilder,
        { provide: CompanyService, useValue: companyServiceSpy },
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    });

    fixture = TestBed.createComponent(CompanyPage);
    component = fixture.componentInstance;
    mockCompanyService = TestBed.inject(CompanyService) as jasmine.SpyObj<CompanyService>;
    mockGlobalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
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
    // Utiliser le composant existant avec fixture pour respecter le contexte d'injection
    component.companyId = 1;
    mockCompanyService.getCompanyById.and.returnValue(mockCompany);
    
    component.ngOnInit();

    expect(mockCompanyService.getCompanyById).toHaveBeenCalledWith(1);
    expect(component.companySelected).toBe(mockCompany);
    expect(component.companyForm.get('name')?.value).toBe(mockCompany.name);
  });

  it('should validate form fields correctly', () => {
    component.ngOnInit();

    // Test required fields
    expect(component.companyForm.valid).toBe(false);

    // Fill valid data
    component.companyForm.patchValue({
      name: 'Valid Company',
      email: 'valid@company.com',
      subdomain: 'valid',
      theme_color: '#ff0000',
      phone: '0123456789'
    });

    expect(component.companyForm.valid).toBe(true);
  });

  it('should call create service when submitting new company', async () => {
    component.ngOnInit();
    component.companySelected = null;
    mockCompanyService.create.and.returnValue(Promise.resolve(mockCompany));
    
    component.companyForm.patchValue({
      name: 'New Company',
      email: 'new@company.com',
      subdomain: 'new',
      theme_color: '#ff0000',
      phone: '0123456789'
    });

    await component.onSubmit();

    expect(mockCompanyService.create).toHaveBeenCalledWith({
      name: 'New Company',
      email: 'new@company.com',
      subdomain: 'new',
      theme_color: '#ff0000',
      phone: '0123456789',
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/company-list']);
  });

  it('should call update service when submitting existing company', async () => {
    component.ngOnInit();
    component.companySelected = mockCompany;
    component.companyId = 1;
    mockCompanyService.update.and.returnValue(Promise.resolve(mockCompany));
    
    component.companyForm.patchValue({
      name: 'Updated Company',
      email: 'updated@company.com',
      subdomain: 'updated',
      theme_color: '#00ff00',
      phone: '0987654321'
    });

    await component.onSubmit();

    expect(mockCompanyService.update).toHaveBeenCalledWith({
      id: 1,
      name: 'Updated Company',
      email: 'updated@company.com',
      subdomain: 'updated',
      theme_color: '#00ff00',
      phone: '0987654321'
    });
   
  });

  it('should handle different navigation based on user role', async () => {
    component.ngOnInit();
    component.companySelected = mockCompany;
    component.companyId = 1;
    mockCompanyService.update.and.returnValue(Promise.resolve(mockCompany));
    
    component.companyForm.patchValue({
      name: 'Test',
      email: 'test@test.com',
      subdomain: 'test',
      theme_color: '#000000',
      phone: '0123456789'
    });

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

  it('should handle errors during form submission', async () => {
    component.ngOnInit();
    component.companySelected = null;
    const errorMessage = 'Creation failed';
    mockCompanyService.create.and.returnValue(Promise.reject(errorMessage));
    spyOn(console, 'log'); // Spy sur console.log pour éviter les logs d'erreur
    
    component.companyForm.patchValue({
      name: 'Test Company',
      email: 'test@company.com',
      subdomain: 'test',
      theme_color: '#ff0000',
      phone: '0123456789'
    });

    await component.onSubmit();

  
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should clear messages when leaving view', () => {
    component.ionViewWillLeave();

    expect(mockMessageService.clearMessage).toHaveBeenCalled();
  });
});