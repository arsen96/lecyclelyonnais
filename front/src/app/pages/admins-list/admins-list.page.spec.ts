import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminsListPage } from './admins-list.page';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AdminsListPage', () => {
  let component: AdminsListPage;
  let fixture: ComponentFixture<AdminsListPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    fixture = TestBed.createComponent(AdminsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
