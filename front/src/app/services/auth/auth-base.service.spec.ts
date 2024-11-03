import { TestBed } from '@angular/core/testing';

import { AuthBaseService } from './auth-base.service';
import { HttpClientModule } from '@angular/common/http';

describe('AuthBaseService', () => {
  let service: AuthBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(AuthBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
