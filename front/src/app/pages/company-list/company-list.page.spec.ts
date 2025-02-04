import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { CompanyListPage } from './company-list.page';
import { CompanyService } from 'src/app/services/company.service';
import { MessageService } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GlobalService } from 'src/app/services/global.service';
import { AdminService } from 'src/app/services/admin.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CompanyListPage', () => {
  let component: CompanyListPage;
  let fixture: ComponentFixture<CompanyListPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [CompanyListPage],
      providers: [
        CompanyService,
        MessageService,
        LoadingService,
        GlobalService,
        AdminService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

