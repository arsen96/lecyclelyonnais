import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeafletListPage } from './leaflet-list.page';
import { of, throwError } from 'rxjs';
import { ZoneService } from 'src/app/services/zone.service';
import { MessageService } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';

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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LeafletListPage);
    component = fixture.componentInstance;
    zoneService = TestBed.inject(ZoneService) as jasmine.SpyObj<ZoneService>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should delete selected items', () => {
    const mockZones = [{ id: 1, zone_name: 'Zone 1' }, { id: 2, zone_name: 'Zone 2' }];
    component.dataSource.data = mockZones;
    component.selection.select(mockZones[0]);

    zoneService.delete.and.returnValue(of({ message: 'Deleted successfully' }));
    loadingService.showLoaderUntilCompleted.and.callFake((obs) => obs);

    component.deleteSelected();

    expect(zoneService.delete).toHaveBeenCalledWith([1]);
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].id).toBe(2);
    expect(messageService.showToast).toHaveBeenCalledWith('Deleted successfully', 'success');
  });

  it('should handle delete error', () => {
    const mockZones = [{ id: 1, zone_name: 'Zone 1' }];
    component.dataSource.data = mockZones;
    component.selection.select(mockZones[0]);

    zoneService.delete.and.returnValue(throwError('Delete error'));
    loadingService.showLoaderUntilCompleted.and.callFake((obs) => obs);

    component.deleteSelected();

    expect(zoneService.delete).toHaveBeenCalledWith([1]);
    expect(messageService.showToast).toHaveBeenCalledWith('Delete error', 'danger');
  });
});
