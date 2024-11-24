import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterventionsPage } from './interventions.page';

describe('InterventionsPage', () => {
  let component: InterventionsPage;
  let fixture: ComponentFixture<InterventionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
