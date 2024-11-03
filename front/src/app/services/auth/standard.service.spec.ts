import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { StandardAuth } from './standard.service';

describe('StandardService', () => {
  let service: StandardAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(StandardAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
