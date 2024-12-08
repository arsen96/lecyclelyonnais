import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MesinterventionsPage } from './mesinterventions.page';

describe('MesinterventionsPage', () => {
  let component: MesinterventionsPage;
  let fixture: ComponentFixture<MesinterventionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MesinterventionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
