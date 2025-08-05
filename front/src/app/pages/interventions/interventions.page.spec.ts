import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { InterventionService } from 'src/app/services/intervention.service';
import { GlobalService } from 'src/app/services/global.service';
import { MessageService, Message } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';
import { BaseService } from 'src/app/services/base.service';
import { ImageModalComponent } from 'src/app/components/image-modal/image-modal.component';
import { Intervention } from 'src/app/models/intervention';
import { InterventionsPage } from 'src/app/pages/interventions/interventions.page';

describe('InterventionsPage', () => {
  let component: InterventionsPage;
  let fixture: ComponentFixture<InterventionsPage>;
  let mockInterventionService: jasmine.SpyObj<InterventionService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockGlobalService: any;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockModalController: jasmine.SpyObj<ModalController>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  // Define mockUser here
  const mockUser = {
    id: 1,
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com'
  };

  const mockInterventions: Intervention[] = [
    {
      id: 1,
      appointment_start: new Date('2024-01-15T10:00:00'),
      appointment_end: new Date('2024-01-15T12:00:00'),
      status: 'scheduled',
      type: 'Maintenance',
      bicycle: { brand: 'Trek', model: 'Domane' },
      technician: { first_name: 'John', last_name: 'Doe' },
      photos: ['photo1.jpg', 'photo2.jpg']
    } as any,
    {
      id: 2,
      appointment_start: new Date('2023-12-01T14:00:00'),
      appointment_end: new Date('2023-12-01T16:00:00'),
      status: 'completed',
      type: 'Réparation',
      bicycle: { brand: 'Giant', model: 'Escape' },
      technician: { first_name: 'Jane', last_name: 'Smith' },
      photos: []
    } as any
  ];

  beforeEach(() => {
    const interventionServiceSpy = jasmine.createSpyObj('InterventionService', ['getInterventionsByUser', 'manageEndIntervention'], {
      interventionsLoaded: Promise.resolve(true),
      allInterventions: mockInterventions
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['showToast']);
    const modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['showLoaderUntilCompleted']);

    mockGlobalService = {
      user: new BehaviorSubject(mockUser)
    };

    TestBed.configureTestingModule({
      declarations: [InterventionsPage],
      providers: [
        { provide: InterventionService, useValue: interventionServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(InterventionsPage);
    component = fixture.componentInstance;
    
    mockInterventionService = TestBed.inject(InterventionService) as jasmine.SpyObj<InterventionService>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    mockModalController = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;
    mockLoadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should be defined but empty (no implementation)', () => {
      expect(component.ngOnInit).toBeDefined();
      expect(() => component.ngOnInit()).not.toThrow();
    });
  });


  describe('cancelIntervention()', () => {
    beforeEach(() => {
      component.pastInterventions = [];
      component.upcomingInterventions = [...mockInterventions];
    });

    it('should cancel intervention successfully', () => {
      const intervention = mockInterventions[0];
      const cancelResponse = { message: 'Intervention cancelled' };
      mockInterventionService.manageEndIntervention.and.returnValue(of(cancelResponse));
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(cancelResponse));
      spyOn(console, 'log');

      component.cancelIntervention(intervention);

      expect(console.log).toHaveBeenCalledWith('Intervention annulée:', intervention);
      expect(mockInterventionService.manageEndIntervention).toHaveBeenCalledWith(1, true, null);
      expect(mockMessageService.showToast).toHaveBeenCalledWith('Intervention cancelled', Message.success);
      expect(component.pastInterventions).toContain(intervention);
      expect(component.upcomingInterventions).not.toContain(intervention);
    });

    it('should handle cancellation errors', () => {
      const intervention = mockInterventions[0];
      const error = 'Cancellation failed';
      mockInterventionService.manageEndIntervention.and.returnValue(throwError(() => error));
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(throwError(() => error));

      component.cancelIntervention(intervention);

      expect(mockMessageService.showToast).toHaveBeenCalledWith(error, Message.danger);
    });
  });

  describe('openImageModal()', () => {
    it('should create and present modal with correct parameters', async () => {
      const photos = ['photo1.jpg', 'photo2.jpg'];
      const index = 1;
      const mockModal = { present: jasmine.createSpy('present') };
      mockModalController.create.and.returnValue(Promise.resolve(mockModal as any));

      await component.openImageModal(photos, index);

      expect(mockModalController.create).toHaveBeenCalledWith({
        component: ImageModalComponent,
        componentProps: {
          photos: [
            `${BaseService.baseApi}/photo1.jpg`,
            `${BaseService.baseApi}/photo2.jpg`
          ],
          index: 1
        }
      });
      expect(mockModal.present).toHaveBeenCalled();
    });

    it('should prepend BaseService.baseApi to photo URLs', async () => {
      const photos = ['test.jpg'];
      const mockModal = { present: jasmine.createSpy('present') };
      mockModalController.create.and.returnValue(Promise.resolve(mockModal as any));

      await component.openImageModal(photos, 0);

      expect(mockModalController.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          componentProps: jasmine.objectContaining({
            photos: [`${BaseService.baseApi}/test.jpg`]
          })
        })
      );
    });
  });

  describe('Component initialization', () => {
    it('should initialize arrays as empty', () => {
      expect(component.userInterventions).toEqual([]);
      expect(component.pastInterventions).toEqual([]);
      expect(component.upcomingInterventions).toEqual([]);
    });

    it('should inject services correctly', () => {
      expect(component.interventionService).toBeDefined();
      expect(component.router).toBeDefined();
      expect(component.globalService).toBeDefined();
      expect(component.messageService).toBeDefined();
      expect(component.modalController).toBeDefined();
      expect(component.loadingService).toBeDefined();
    });
  });
});