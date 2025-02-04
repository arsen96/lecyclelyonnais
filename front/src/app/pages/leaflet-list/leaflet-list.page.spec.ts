import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeafletListPage } from './leaflet-list.page';
import { of, throwError } from 'rxjs';
import { ZoneService } from 'src/app/services/zone.service';
import { MessageService } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LeafletListPage', () => {
  let component: LeafletListPage;
  let fixture: ComponentFixture<LeafletListPage>;
  let zoneService: jasmine.SpyObj<ZoneService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let loadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    const zoneServiceSpy = jasmine.createSpyObj('ZoneService', ['getZones', 'deleteZones']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['showToast']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['showLoaderUntilCompleted']);

    TestBed.configureTestingModule({
      declarations: [LeafletListPage],
      providers: [
        { provide: ZoneService, useValue: zoneServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LeafletListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  


});
