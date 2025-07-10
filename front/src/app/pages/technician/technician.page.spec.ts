import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnicianPage } from './technician.page';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { TechnicianService } from '../../services/technician.service';
import { ZoneService } from '../../services/zone.service';
import { MessageService } from '../../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Technician } from 'src/app/models/technicians';

class MockTechnicianService {
  technicians = [
    { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', phone: '0123456789', address: '123 Main St' }
  ];
  
  get() {
    return Promise.resolve(this.technicians);
  }
  
  create(technician: Technician) {
    return Promise.resolve({ message: 'Created successfully' });
  }
  
  update(technician: Technician) {
    return Promise.resolve({ message: 'Updated successfully' });
  }
}

class MockZoneService {
  allZones = [];
}

class MockMessageService {
  showMessage(message: string, type: string) {}
  clearMessage() {}
}

class MockActivatedRoute {
  snapshot = { params: { id: null } };
}

describe('TechnicianPage', () => {
  let component: TechnicianPage;
  let fixture: ComponentFixture<TechnicianPage>;
  let technicianService: MockTechnicianService;
  let messageService: MockMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [TechnicianPage],
      providers: [
        provideHttpClient(withFetch()),
        FormBuilder,
        { provide: TechnicianService, useClass: MockTechnicianService },
        { provide: ZoneService, useClass: MockZoneService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
      ],
    });

    fixture = TestBed.createComponent(TechnicianPage);
    component = fixture.componentInstance;
    technicianService = TestBed.inject(TechnicianService) as any;
    messageService = TestBed.inject(MessageService) as any;
    fixture.detectChanges();
  });

  // Test de création du composant
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test de manageForm()
  it('should call manageForm and initialize form', async () => {
    spyOn(technicianService, 'get').and.returnValue(Promise.resolve([]));
    
    await component.manageForm();
    
    expect(technicianService.get).toHaveBeenCalled();
    expect(component.technicianForm).toBeDefined();
  });

  // Test de generatePassword()
  it('should generate password', async () => {
    await component.manageForm();
    
    component.generatePassword();
    
    const password = component.technicianForm.get('password')?.value;
    expect(password).toBeDefined();
    expect(password.length).toBe(8);
  });

  // Test de handleAddressChange()
  it('should handle address change', async () => {
    await component.manageForm();
    const mockPlace = {
      geometry: { location: { lat: () => 40.7128, lng: () => -74.0060 } },
      formatted_address: '123 Valid Street'
    };
    
    component.handleAddressChange(mockPlace);
    
    expect(component.technicianForm.get('address')?.value).toBe('123 Valid Street');
    expect(component.addressValidated).toBe(true);
  });

  // Test de onSubmit() - mode création
  it('should call create service on submit for new technician', async () => {
    spyOn(technicianService, 'create').and.returnValue(Promise.resolve({ message: 'Success' }));
    await component.manageForm();
    component.technicianForm.patchValue({
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      password: 'password123',
      phone: '0123456789',
      address: '123 Test St'
    });
    component.addressValidated = true;
    
    await component.onSubmit();
    
    expect(technicianService.create).toHaveBeenCalled();
  });

  // Test de onSubmit() - mode édition
  it('should call update service on submit for existing technician', async () => {
    spyOn(technicianService, 'update').and.returnValue(Promise.resolve({ message: 'Updated' }));
    
    // Simuler le mode édition en définissant l'ID et le technicien sélectionné
    component.technicianId = 1;
    component.technicianSelected = { id: 1, first_name: 'John' };
    
    await component.manageForm();
    
    component.technicianForm.patchValue({
      first_name: 'Updated',
      last_name: 'User',
      email: 'test@example.com',
      phone: '0123456789',
      address: '123 Test St'
    });
    
    await component.onSubmit();
    
    expect(technicianService.update).toHaveBeenCalledWith(jasmine.objectContaining({
      id: 1,
      first_name: 'Updated',
      last_name: 'User',
      email: 'test@example.com',
      phone: '0123456789',
      address: '123 Test St'
    }));
  });

  // Test de onSubmit() - gestion d'erreur
  it('should handle error on submit', async () => {
    spyOn(technicianService, 'create').and.returnValue(Promise.reject('Error occurred'));
    spyOn(messageService, 'showMessage');
    await component.manageForm();
    component.technicianForm.patchValue({
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      password: 'password123',
      phone: '0123456789',
      address: '123 Test St'
    });
    component.addressValidated = true;
    
    await component.onSubmit();
    
    expect(messageService.showMessage).toHaveBeenCalledWith('Error occurred', jasmine.any(String));
  });

  // Test de ionViewWillLeave()
  it('should clear message on ionViewWillLeave', () => {
    spyOn(messageService, 'clearMessage');
    
    component.ionViewWillLeave();
    
    expect(messageService.clearMessage).toHaveBeenCalled();
  });

  // Test de resetForm()
  it('should reset form', async () => {
    await component.manageForm();
    // tester le COMPORTEMENT de ton composant, pas le SERVICE  c'est pour cela que tu dois spy sur les methodes de ton composant
    spyOn(messageService, 'clearMessage');
    
    component.resetForm();
    
    expect(messageService.clearMessage).toHaveBeenCalled();
    expect(component.addressValidated).toBe(false);
  });
});