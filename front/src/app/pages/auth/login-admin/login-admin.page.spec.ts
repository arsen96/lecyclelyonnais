import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginAdminPage } from './login-admin.page';
import { LoginAdminPageModule } from './login-admin.module';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('LoginAdminPage', () => {
  let component: LoginAdminPage;
  let fixture: ComponentFixture<LoginAdminPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginAdminPageModule],
      declarations: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(), 
        provideRouter([])
      ],
    });
    fixture = TestBed.createComponent(LoginAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
