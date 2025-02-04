import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterventionsPage } from './interventions.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

describe('InterventionsPage', () => {
  let component: InterventionsPage;
  let fixture: ComponentFixture<InterventionsPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterventionsPage],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        IonicModule.forRoot()
      ]
    });
    fixture = TestBed.createComponent(InterventionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
