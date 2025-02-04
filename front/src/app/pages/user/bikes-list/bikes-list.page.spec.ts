import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BikesListPage } from './bikes-list.page';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('BikesListPage', () => {
  let component: BikesListPage;
  let fixture: ComponentFixture<BikesListPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BikesListPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    fixture = TestBed.createComponent(BikesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
