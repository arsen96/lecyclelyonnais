import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanningModelsListPage } from './planning-models-list.page';

describe('PlanningModelsListPage', () => {
  let component: PlanningModelsListPage;
  let fixture: ComponentFixture<PlanningModelsListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningModelsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
