import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyPage } from './company.page';
import { CompanyService } from 'src/app/services/company.service';
import { GlobalService, UserRole } from 'src/app/services/global.service';
import { MessageService } from 'src/app/services/message.service';
import { Company } from 'src/app/models/company';
import { BehaviorSubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CompanyPage', () => {
  let component: CompanyPage;
  let fixture: ComponentFixture<CompanyPage>;
  let mockCompanyService: jasmine.SpyObj<CompanyService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockGlobalService: any;

  const testCompany: Company = {
    id: 1,
    name: 'Test Company',
    email: 'test@example.com',
    subdomain: 'test',
    theme_color: '#ff0000',
    phone: '0123456789'
  };

  beforeEach(() => {
    mockCompanyService = jasmine.createSpyObj('CompanyService', [
      'getCompanyById', 'update', 'create', 'get'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMessageService = jasmine.createSpyObj('MessageService', [
      'showMessage', 'clearMessage'
    ]);
    mockGlobalService = {
      userRole: new BehaviorSubject(UserRole.SUPERADMIN)
    };

    mockCompanyService.companies = [];

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CompanyPage],
      providers: [
        FormBuilder,
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(CompanyPage);
    component = fixture.componentInstance;
  });


  it('should initialize form', () => {
    component.ngOnInit();
    
    expect(component.companyForm).toBeDefined();
    expect(component.companyForm.get('name')).toBeDefined();
    expect(component.companyForm.get('email')).toBeDefined();
  });

  it('should load company when editing', () => {
    component.companyId = 1;
    mockCompanyService.getCompanyById.and.returnValue(testCompany);
    
    component.ngOnInit();
    
    expect(component.companySelected).toBe(testCompany);
    expect(component.companyForm.get('name')?.value).toBe('Test Company');
  });

  it('should create company on submit', async () => {
    component.ngOnInit();
    component.companyForm.patchValue(testCompany);
    mockCompanyService.create.and.returnValue(Promise.resolve(testCompany));
    
    await component.onSubmit();
    
    expect(mockCompanyService.create).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/company-list']);
  });

  it('should update company on submit when editing', async () => {
    // Étape 1: Configurer le mode édition AVANT ngOnInit
    component.companyId = 1;
    mockCompanyService.getCompanyById.and.returnValue(testCompany);
    
    // Étape 2: Initialiser le composant
    component.ngOnInit();
    
    // Étape 3: Vérifier que companySelected est défini
    expect(component.companySelected).toBe(testCompany);
    
    // Étape 4: Remplir le formulaire avec des données valides
    component.companyForm.patchValue({
      name: 'Updated Company',
      email: 'updated@example.com',
      subdomain: 'updated',
      theme_color: '#00ff00',
      phone: '0987654321'
    });
    
    // Étape 5: Configurer le mock pour retourner une promesse
    mockCompanyService.update.and.returnValue(Promise.resolve(testCompany));
    
    // Étape 6: Appeler onSubmit et attendre
    await component.onSubmit();
    
    // Étape 7: Vérifier que update a été appelé
    expect(mockCompanyService.update).toHaveBeenCalledWith(
      jasmine.objectContaining({ 
        id: 1,
        name: 'Updated Company'
      })
    );
  });

});