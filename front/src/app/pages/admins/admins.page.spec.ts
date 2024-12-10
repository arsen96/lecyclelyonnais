import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminsPage } from './admins.page';

describe('AdminsPage', () => {
  let component: AdminsPage;
  let fixture: ComponentFixture<AdminsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
