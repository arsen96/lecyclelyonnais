import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { BaseService } from "./base.service";
import { PlanningModelService } from "./planning-model.service";
import { TestBed } from "@angular/core/testing";
import { CompanyService } from "./company.service";
import { provideHttpClient } from "@angular/common/http";

describe('PlanningModelService', () => {
  let service: PlanningModelService;
  let httpMock: HttpTestingController;

  const mockModels = [
    { id: 1, name: 'Maintenance Standard', available_days: '{"monday":true}' },
    { id: 2, name: 'Réparation Express', available_days: '{"tuesday":true}' }
  ];

  beforeEach(() => {
    const companyServiceSpy = jasmine.createSpyObj('CompanyService', [], {
      subdomainREQ: { domain: 'test' }
    });

    TestBed.configureTestingModule({
      providers: [
        PlanningModelService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CompanyService, useValue: companyServiceSpy }
      ]
    });

    service = TestBed.inject(PlanningModelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    it('should return cached data without HTTP call', async () => {
      // Préremplir le cache avec des données
      service.allPlanningModels = [...mockModels] as any;

      const result = await service.get();

      expect(result).toEqual(mockModels as any);
      httpMock.expectNone(`${BaseService.baseApi}/planning-models/get?domain=test`);
    });

    it('should fetch from API when cache empty', async () => {
      const resultPromise = service.get();

      const req = httpMock.expectOne(`${BaseService.baseApi}/planning-models/get?domain=test`);
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockModels });

      const result = await resultPromise;
      expect(result).toEqual(mockModels as any);
    });

    it('should parse JSON in available_days field', async () => {
      const resultPromise = service.get();

      const req = httpMock.expectOne(`${BaseService.baseApi}/planning-models/get?domain=test`);
      expect(req.request.method).toBe('GET');
      req.flush({ data: [{ id: 1, available_days: '{"monday":true}' }] });

      await resultPromise;
      expect(service.allPlanningModels[0].available_days).toEqual({ monday: true });
    });
  });

  describe('create()', () => {
    it('should POST to save endpoint with domain', (done) => {
      const data = { name: 'New Model' };

      service.create(data).subscribe(() => done());

      const req = httpMock.expectOne(`${BaseService.baseApi}/planning-models/save`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ ...data, domain: 'test' });
      req.flush({});
    });
  });

  describe('update()', () => {
    it('should PUT to update endpoint', (done) => {
      const data = { id: 1, name: 'Updated' };

      service.update(data).subscribe(() => done());

      const req = httpMock.expectOne(`${BaseService.baseApi}/planning-models/update/1`);
      expect(req.request.method).toBe('PUT');
      req.flush({});
    });
  });

  describe('delete()', () => {
    it('should remove items from cache after successful delete', (done) => {
      service.allPlanningModels = [...mockModels] as any;

      service.delete([1]).subscribe(() => {
        expect(service.allPlanningModels.some(m => m.id === 1)).toBe(false);
        done();
      });

      const req = httpMock.expectOne(`${BaseService.baseApi}/planning-models/delete`);
      req.flush({});
    });
  });
});