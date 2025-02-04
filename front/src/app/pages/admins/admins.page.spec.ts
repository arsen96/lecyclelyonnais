import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminsPage } from './admins.page';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('AdminsPage', () => {
  let component: AdminsPage;
  let fixture: ComponentFixture<AdminsPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });
    fixture = TestBed.createComponent(AdminsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
