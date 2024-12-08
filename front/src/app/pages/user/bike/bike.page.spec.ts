import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BikePage } from './bike.page';

describe('AddBikePage', () => {
  let component: BikePage;
  let fixture: ComponentFixture<BikePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BikePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
