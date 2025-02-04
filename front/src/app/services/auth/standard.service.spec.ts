import { TestBed } from '@angular/core/testing';
import {  provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { StandardAuth } from './standard.service';

describe('StandardService', () => {
  let service: StandardAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(StandardAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
