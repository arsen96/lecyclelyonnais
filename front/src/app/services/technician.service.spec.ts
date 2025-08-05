import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TechnicianService } from './technician.service';
import { CompanyService } from './company.service';
import { BaseService } from './base.service';

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
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get technicians from API', async () => {
    service.technicians = [];
    
    const resultPromise = service.get();
    
    const req = httpMock.expectOne(`${BaseService.baseApi}/technicians/get`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTechnicians);
    
    const result = await resultPromise;
    expect(result).toEqual(mockTechnicians);
    expect(service.technicians).toEqual(mockTechnicians);
  });

  it('should return cached technicians without API call', async () => {
    service.technicians = mockTechnicians;
    
    const result = await service.get();
    
    expect(result).toEqual(mockTechnicians);
    httpMock.expectNone(`${BaseService.baseApi}/technicians/get`);
  });

  it('should create technician', async () => {
    const newTechnician = { first_name: 'Bob', last_name: 'Johnson' };
    const createdTechnician = { id: 3, ...newTechnician };

    const resultPromise = service.create(newTechnician as any);

    const req = httpMock.expectOne(`${BaseService.baseApi}/technicians/save`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ ...newTechnician, domain: 'test' });
    req.flush(createdTechnician);

    const result = await resultPromise;
    expect(result).toEqual(createdTechnician);
    expect(service.technicians).toContain(createdTechnician as any);
  });

  it('should update technician', async () => {
    service.technicians = [mockTechnicians[0]];
    const updatedTechnician = { ...mockTechnicians[0], first_name: 'Updated' };

    const resultPromise = service.update(updatedTechnician as any);

    const req = httpMock.expectOne(`${BaseService.baseApi}/technicians/update`);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Updated' });

    await resultPromise;
    expect(service.technicians[0].first_name).toBe('Updated');
  });

  it('should delete technicians and set zone to null', (done) => {
    service.technicians = [...mockTechnicians];

    service.delete([1]).subscribe(() => {
      expect(service.technicians[0].geographical_zone_id).toBe(null);
      done();
    });

    const req = httpMock.expectOne(`${BaseService.baseApi}/technicians/delete`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ ids: [1] });
    req.flush({ message: 'Deleted' });
  });

  describe('Async methods', () => {
    beforeEach(() => {
      service.technicians = mockTechnicians;
      service['initialized'] = true;
    });

    it('should get technician by ID', async () => {
      const result = await service.getTechnicianById(1);
      expect(result).toEqual(mockTechnicians[0]);
    });

    it('should return undefined for non-existent ID', async () => {
      const result = await service.getTechnicianById(999);
      expect(result).toBeUndefined();
    });


    it('should return empty array for non-existent zone', async () => {
      const result = await service.getTechniciansByZone(999);
      expect(result).toEqual([]);
    });
  });

  describe('Sync methods', () => {
    beforeEach(() => {
      service.technicians = mockTechnicians;
    });

    it('should get technician by ID sync', () => {
      const result = service.getTechnicianByIdSync(1);
      expect(result).toEqual(mockTechnicians[0]);
    });

  });
});