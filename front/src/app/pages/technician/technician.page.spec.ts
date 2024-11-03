import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnicianPage } from './technician.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TechnicianService } from '../../services/technician.service';
import { of } from 'rxjs';

class MockTechnicianService {
  // Mock any methods used in TechnicianPage
  getData() {
    return of([]); // Return an observable with mock data
  }
}

describe('TechnicianPage', () => {
  let component: TechnicianPage;
  let fixture: ComponentFixture<TechnicianPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Use HttpClientTestingModule for testing
      declarations: [TechnicianPage],
      providers: [
        { provide: TechnicianService, useClass: MockTechnicianService }, // Use the mock service
      ],
    });

    fixture = TestBed.createComponent(TechnicianPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
