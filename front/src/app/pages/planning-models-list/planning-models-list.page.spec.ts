import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanningModelsListPage } from './planning-models-list.page';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('PlanningModelsListPage', () => {
  let component: PlanningModelsListPage;
  let fixture: ComponentFixture<PlanningModelsListPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    fixture = TestBed.createComponent(PlanningModelsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
