import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UsersListPage } from './users-list.page';
import { provideHttpClient } from '@angular/common/http';
describe('UsersListPage', () => {
  let component: UsersListPage;
  let fixture: ComponentFixture<UsersListPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersListPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    fixture = TestBed.createComponent(UsersListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
