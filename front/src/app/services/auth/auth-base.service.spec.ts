import { TestBed } from '@angular/core/testing';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthBaseService } from './auth-base.service';

describe('AuthBaseService', () => {
  let service: AuthBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(AuthBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
