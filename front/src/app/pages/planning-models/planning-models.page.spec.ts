import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanningModelsPage } from './planning-models.page';

describe('PlanningModelsPage', () => {
  let component: PlanningModelsPage;
  let fixture: ComponentFixture<PlanningModelsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningModelsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
