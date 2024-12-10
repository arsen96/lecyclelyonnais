import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminsListPage } from './admins-list.page';

describe('AdminsListPage', () => {
  let component: AdminsListPage;
  let fixture: ComponentFixture<AdminsListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
