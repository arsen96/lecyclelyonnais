import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { BicycleService } from './bicycle.service';
import { GlobalService } from './global.service';
import { BaseService } from './base.service';
import { BehaviorSubject, of } from 'rxjs';

describe('BicycleService', () => {
  let service: BicycleService;
  let httpMock: HttpTestingController;

  const mockBicycles = [
    { id: 1, brand: 'Trek', model: 'Domane', c_year: 2023, type: 'Vélo classique' },
    { id: 2, brand: 'Giant', model: 'Escape', c_year: 2022, type: 'Vélo électrique (VAE)' }
  ];

  beforeEach(() => {
    const globalServiceSpy = jasmine.createSpyObj('GlobalService', [], {
      user: new BehaviorSubject({ id: 1 })
    });

    TestBed.configureTestingModule({
      providers: [
        BicycleService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: GlobalService, useValue: globalServiceSpy }
      ]
    });

    service = TestBed.inject(BicycleService);
    httpMock = TestBed.inject(HttpTestingController);

    // Gérer l'appel HTTP du constructeur
    const req = httpMock.expectOne(`${BaseService.baseApi}/bicycles/get`);
    req.flush({ data: [] });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    it('should fetch all bicycles from API', (done) => {
      service.get().subscribe(result => {
        expect(result).toBeDefined();
        done();
      });

      const req = httpMock.expectOne(`${BaseService.baseApi}/bicycles/get`);
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockBicycles });
    });

    it('should update bicyclesLoaded subject on success', (done) => {
      service.bicyclesLoaded.subscribe(loaded => {
        if (loaded === true) {
          done();
        }
      });

      service.get().subscribe();

      const req = httpMock.expectOne(`${BaseService.baseApi}/bicycles/get`);
      req.flush({ data: mockBicycles });
    });
  });

  describe('getUserBicycles()', () => {
    it('should return cached user bicycles', (done) => {
      service.userBicycles = [...mockBicycles] as any;

      service.getUserBicycles().subscribe(result => {
        expect(result).toEqual(mockBicycles as any);
        done();
      });

      httpMock.expectNone(`${BaseService.baseApi}/bicycles/getUserBicycles`);
    });

  });

  describe('create()', () => {
    it('should POST to addNew endpoint', (done) => {
      const newBicycle = { brand: 'Specialized', model: 'Sirrus', year: 2024, type: 'VTT' };

      service.create(newBicycle as any).subscribe(() => done());

      const req = httpMock.expectOne(`${BaseService.baseApi}/bicycles/addNew`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newBicycle);
      req.flush({});
    });
  });

  describe('update()', () => {
    it('should POST to updateBicycle endpoint with id', (done) => {
      const bicycleData = { brand: 'Updated Brand', model: 'Updated Model' };

      service.update(1, bicycleData as any).subscribe(() => done());

      const req = httpMock.expectOne(`${BaseService.baseApi}/bicycles/updateBicycle`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ id: 1, ...bicycleData });
      req.flush({});
    });
  });

  describe('delete()', () => {
    it('should POST to deleteBicycles endpoint', (done) => {
      const idsToDelete = [1, 2];

      service.delete(idsToDelete).subscribe(() => done());

      const req = httpMock.expectOne(`${BaseService.baseApi}/bicycles/deleteBicycles`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual({ ids: idsToDelete });
      req.flush({});
    });
  });

  describe('resetBicyclesLoaded()', () => {
    it('should create new ReplaySubject', () => {
      const originalSubject = service.bicyclesLoaded;

      service.resetBicyclesLoaded();

      expect(service.bicyclesLoaded).not.toBe(originalSubject);
    });
  });
});