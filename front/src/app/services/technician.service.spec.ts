import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TechnicianService } from './technician.service';
import { CompanyService } from './company.service';
import { BaseService } from './base.service';
import { Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

describe('TechnicianService', () => {
  let service: TechnicianService;
  let httpMock: HttpTestingController;

  const mockTechnicians = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '0123456789',
      address: '123 Main St',
      created_at: '2021-01-01',
      is_available: true,
      password: 'password123',
      geographical_zone_id: 1
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      phone: '0987654321',
      address: '456 Oak Ave',
      created_at: '2021-01-01',
      is_available: true,
      password: 'password123',
      geographical_zone_id: 2
    }
  ];

  beforeEach(() => {
    // Mock CompanyService avec spy
    const companyServiceSpy = jasmine.createSpyObj('CompanyService', [], {
      subdomainREQ: { domain: 'test' }
    });

    TestBed.configureTestingModule({
      providers: [
        TechnicianService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CompanyService, useValue: companyServiceSpy }
      ]
    });

    service = TestBed.inject(TechnicianService);
    httpMock = TestBed.inject(HttpTestingController);

    // Gérer l'appel HTTP du constructeur
    const req = httpMock.expectOne(`${BaseService.baseApi}/technicians/get`);
    req.flush([]);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ================================================================
  // 🏗️ TESTS DE CONFIGURATION ET INITIALISATION
  // ================================================================
  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with empty technicians array', () => {
      expect(service.technicians).toEqual([]);
    });
  });

  // ================================================================
  // 📊 TESTS DE CACHE - Tests du système de mise en cache
  // ================================================================
  describe('🔄 Cache Management', () => {
    describe('when cache is populated', () => {
      it('should return cached technicians WITHOUT making HTTP call', async () => {
        // ARRANGE - Pré-remplir le cache
        service.technicians = mockTechnicians;

        // ACT - Appeler get()
        const result = await service.get();

        // ASSERT 
        expect(result).toEqual(mockTechnicians);
        // ⭐ CRUCIAL : Vérifier qu'AUCUN appel HTTP n'est fait
        httpMock.expectNone(`${BaseService.baseApi}/technicians/get`);
      });

      it('should return cached data immediately without async operations', async () => {
        // ARRANGE
        service.technicians = mockTechnicians;
        const startTime = Date.now();

        // ACT
        const result = await service.get();
        const endTime = Date.now();

        // ASSERT
        expect(result).toEqual(mockTechnicians);
        // Le cache devrait être quasi-instantané (< 10ms)
        expect(endTime - startTime).toBeLessThan(10);
      });
    });

    describe('when cache is empty', () => {
      it('should make HTTP call and populate cache', async () => {
        // ARRANGE - S'assurer que le cache est vide
        service.technicians = [];

        // ACT
        const resultPromise = service.get();

        // ASSERT - Vérifier l'appel HTTP
        const req = httpMock.expectOne(`${BaseService.baseApi}/technicians/get`);
        expect(req.request.method).toBe('GET');
        req.flush(mockTechnicians);

        const result = await resultPromise;
        expect(result).toEqual(mockTechnicians);
        // ⭐ IMPORTANT : Vérifier que le cache est mis à jour
        expect(service.technicians).toEqual(mockTechnicians);
      });
    });
  });

  // ================================================================
  // 🌐 TESTS HTTP - Tests des vraies interactions avec l'API
  // ================================================================
  describe('🌐 HTTP Operations', () => {
    describe('get() - API Calls', () => {
      it('should call correct endpoint with GET method', async () => {
        // ARRANGE
        service.technicians = [];

        // ACT
        const resultPromise = service.get();

        // ASSERT - Vérifier le contrat d'API
        const req = httpMock.expectOne(`${BaseService.baseApi}/technicians/get`);
        expect(req.request.method).toBe('GET');
        expect(req.request.url).toBe(`${BaseService.baseApi}/technicians/get`);
        
        req.flush(mockTechnicians);
        await resultPromise;
      });

      it('should handle HTTP errors and return HttpErrorResponse', async () => {
        // ARRANGE
        service.technicians = [];

        // ACT
        const resultPromise = service.get();

        // ASSERT
        const req = httpMock.expectOne(`${BaseService.baseApi}/technicians/get`);
        req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

        const result = await resultPromise;
        expect(result).toBeInstanceOf(HttpErrorResponse);
        expect((result as any).status).toBe(500);
        expect((result as any).statusText).toBe('Internal Server Error');
      });

      it('should update techniciansLoaded subject on successful API call', async () => {
        // ARRANGE
        service.technicians = [];
        spyOn(service.techniciansLoaded, 'next');

        // ACT
        const resultPromise = service.get();

        // ASSERT
        const req = httpMock.expectOne(`${BaseService.baseApi}/technicians/get`);
        req.flush(mockTechnicians);

        await resultPromise;
        expect(service.techniciansLoaded.next).toHaveBeenCalledWith(true);
      });

      it('should update techniciansLoaded subject on API error', async () => {
        // ARRANGE
        service.technicians = [];
        spyOn(service.techniciansLoaded, 'next');

        // ACT
        const resultPromise = service.get();

        // ASSERT
        const req = httpMock.expectOne(`${BaseService.baseApi}/technicians/get`);
        req.flush('Network error', { status: 500, statusText: 'Network error' });

        await resultPromise;
        expect(service.techniciansLoaded.next).toHaveBeenCalledWith(false);
      });
    });

    describe('create() - API Calls', () => {
      it('should send POST request with correct payload including domain', async () => {
        // ARRANGE
        const newTechnician = {
          first_name: 'Bob',
          last_name: 'Johnson',
          email: 'bob@example.com',
          phone: '0555123456',
          address: '789 Pine St',
          created_at: '2021-01-01',
          is_available: true,
          password: 'password123',
          geographical_zone_id: 1
        };
        const createdTechnician = { id: 3, ...newTechnician };

        // ACT
        const resultPromise = service.create(newTechnician as any);

        // ASSERT - Vérifier le contrat d'API
        const req = httpMock.expectOne(`${BaseService.baseApi}/technicians/save`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({
          ...newTechnician,
          domain: 'test' // 
        });

        req.flush(createdTechnician);
        const result = await resultPromise;

        expect(result).toEqual(createdTechnician);
        // ⭐ IMPORTANT : Vérifier que le cache local est mis à jour
        expect(service.technicians).toContain(createdTechnician);
      });

      it('should handle create errors properly', async () => {
        // ARRANGE
        const newTechnician = { first_name: 'Bob' };

        // ACT
        const resultPromise = service.create(newTechnician as any);

        // ASSERT
        const req = httpMock.expectOne(`${BaseService.baseApi}/technicians/save`);
        req.flush('Create error', { status: 400, statusText: 'Bad Request' });

        await expectAsync(resultPromise).toBeRejected();
      });
    });

    describe('update() - API Calls', () => {
      it('should send POST request with correct payload including domain', async () => {
        // ARRANGE
        const updatedTechnician = {
          id: 1,
          first_name: 'John Updated',
          last_name: 'Doe',
          email: 'john.updated@example.com',
          phone: '0123456789',
          address: '123 Main St',
          password: ''
        };

        // ACT
        const resultPromise = service.update(updatedTechnician as any);

        // ASSERT
        const req = httpMock.expectOne(`${BaseService.baseApi}/technicians/update`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({
          ...updatedTechnician,
          domain: 'test' // ⭐ Vérifier que le domaine est ajouté
        });

        req.flush({ message: 'Updated successfully' });
        const result = await resultPromise;

        expect(result).toEqual({ message: 'Updated successfully' });
      });
    });

    describe('delete() - API Calls', () => {
      it('should send DELETE request and update local cache', (done) => {
        // ARRANGE
        service.technicians = [...mockTechnicians];
        const idsToDelete = [1, 2];

        // ACT
        const result$ = service.delete(idsToDelete);

        // ASSERT
        result$.subscribe({
          next: (result) => {
            expect(result).toEqual({ message: 'Deleted successfully' } as any);
            
            // ⭐ IMPORTANT : Vérifier la logique métier spécifique
            // Les techniciens supprimés doivent avoir geographical_zone_id = null
            service.technicians.forEach(technician => {
              if (idsToDelete.includes(technician.id)) {
                expect(technician.geographical_zone_id).toBe(null);
              }
            });
            
            done();
          },
          error: (error) => {
            done.fail(error);
          }
        });

        const req = httpMock.expectOne(`${BaseService.baseApi}/technicians/delete`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ ids: idsToDelete });
        req.flush({ message: 'Deleted successfully' });
      });
    });
  });

  // ================================================================
  // 🔍 TESTS DE LOGIQUE MÉTIER - Tests des fonctions pures
  // ================================================================
  describe('🔍 Business Logic - Pure Functions', () => {
    beforeEach(() => {
      // Préparer les données pour les tests de logique métier
      service.technicians = mockTechnicians;
    });

    describe('getTechnicianById()', () => {
      it('should return correct technician for valid ID', () => {
        // ACT
        const result = service.getTechnicianById(1);

        // ASSERT
        expect(result).toEqual(mockTechnicians[0]);
      });

      it('should return undefined for non-existent ID', () => {
        // ACT
        const result = service.getTechnicianById(999);

        // ASSERT
        expect(result).toBeUndefined();
      });

      it('should return undefined when technicians array is empty', () => {
        // ARRANGE
        service.technicians = [];

        // ACT
        const result = service.getTechnicianById(1);

        // ASSERT
        expect(result).toBeUndefined();
      });
    });

    describe('getTechniciansByZone()', () => {

      it('should return empty array for non-existent zone', () => {
        // ACT
        const result = service.getTechniciansByZone(999);

        // ASSERT
        expect(result).toEqual([]);
      });

      it('should return empty array when no technicians match zone', () => {
        // ARRANGE - Créer des techniciens sans zone
        service.technicians = [
          { ...mockTechnicians[0], geographical_zone_id: null },
          { ...mockTechnicians[1], geographical_zone_id: null }
        ];

        // ACT
        const result = service.getTechniciansByZone(1);

        // ASSERT
        expect(result).toEqual([]);
      });

      it('should return multiple technicians for same zone', () => {
        // ARRANGE - Tous les techniciens dans la même zone
        service.technicians = [
          { ...mockTechnicians[0], geographical_zone_id: 5 },
          { ...mockTechnicians[1], geographical_zone_id: 5 }
        ];

        // ACT
        const result = service.getTechniciansByZone(5);

        // ASSERT
        expect(result.length).toBe(2);
        expect(result.every(t => t.geographical_zone_id === 5)).toBe(true);
      });
    });
  });

  // ================================================================
  // 🔄 TESTS UTILITAIRES - Tests des fonctions d'aide
  // ================================================================
  describe('🔄 Utility Functions', () => {
    describe('resetTechniciansLoaded()', () => {
      it('should create new ReplaySubject instance', () => {
        // ARRANGE
        const originalSubject = service.techniciansLoaded;

        // ACT
        service.resetTechniciansLoaded();

        // ASSERT
        expect(service.techniciansLoaded).not.toBe(originalSubject);
        expect(service.techniciansLoaded).toBeDefined();
      });
    });
  });

  // ================================================================
  // 🔗 TESTS D'INTÉGRATION - Tests du workflow complet
  // ================================================================
  describe('🔗 Integration Tests - Full CRUD Workflow', () => {
    it('should handle complete create-update-delete workflow', async () => {
      // ⭐ CREATE
      const newTechnician = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        phone: '0123456789',
        address: '123 Test St',
        created_at: '',
        is_available: true,
        geographical_zone_id: 0
      };

      const createPromise = service.create(newTechnician as any);
      const createReq = httpMock.expectOne(`${BaseService.baseApi}/technicians/save`);
      expect(createReq.request.method).toBe('POST');
      createReq.flush({ id: 3, ...newTechnician });
      const created = await createPromise;

      expect(created.id).toBe(3);
      expect(service.technicians).toContain(created);

      // ⭐ UPDATE
      const updatedData = { ...created, first_name: 'Updated' };
      const updatePromise = service.update(updatedData);
      const updateReq = httpMock.expectOne(`${BaseService.baseApi}/technicians/update`);
      expect(updateReq.request.method).toBe('POST');
      updateReq.flush({ message: 'Updated' });
      await updatePromise;

      // ⭐ DELETE
      const deleteObs = service.delete([created.id]) as Observable<any>;
      const deletePromise = lastValueFrom(deleteObs);
      const deleteReq = httpMock.expectOne(`${BaseService.baseApi}/technicians/delete`);
      expect(deleteReq.request.method).toBe('POST');
      expect(deleteReq.request.body).toEqual({ ids: [created.id] });
      deleteReq.flush({ message: 'Deleted' });

      const deleteResult = await deletePromise;
      expect(deleteResult).toEqual({ message: 'Deleted' } as any);
    });
  });
});