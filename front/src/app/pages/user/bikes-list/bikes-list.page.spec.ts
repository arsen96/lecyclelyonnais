import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BikesListPage } from './bikes-list.page';

describe('BikesListPage', () => {
  let component: BikesListPage;
  let fixture: ComponentFixture<BikesListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BikesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
