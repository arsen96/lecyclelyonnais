import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { BicycleService } from './bicycle.service';

describe('BicycleService', () => {
  let service: BicycleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(BicycleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
