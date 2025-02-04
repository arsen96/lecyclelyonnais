import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionsPage } from './actions.page';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ActionsPage', () => {
  let component: ActionsPage;
  let fixture: ComponentFixture<ActionsPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    fixture = TestBed.createComponent(ActionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
