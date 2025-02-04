import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MesinterventionsPage } from './mesinterventions.page';
import { IonicModule, ModalController } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('MesinterventionsPage', () => {
  let component: MesinterventionsPage;
  let fixture: ComponentFixture<MesinterventionsPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        IonicModule.forRoot()
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(MesinterventionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
