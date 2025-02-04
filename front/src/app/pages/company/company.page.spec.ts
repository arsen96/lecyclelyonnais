import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyPage } from './company.page';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

describe('CompanyPage', () => {
  let component: CompanyPage;
  let fixture: ComponentFixture<CompanyPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });

    fixture = TestBed.createComponent(CompanyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
