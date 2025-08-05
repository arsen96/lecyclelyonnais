import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { of, throwError } from 'rxjs';

import { LeafletListPage } from './leaflet-list.page';
import { ZoneService } from 'src/app/services/zone.service';
import { MessageService } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';

describe('LeafletListPage', () => {
  let component: LeafletListPage;
  let fixture: ComponentFixture<LeafletListPage>;
  let mockZoneService: jasmine.SpyObj<ZoneService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  const mockZones = [
    { id: 1, zone_name: 'Zone A', created_at: '2023-01-01', geojson: { type: 'FeatureCollection', features: [] }, model_planification: { maintenance: {}, repair: {} }, technicians: [] },
    { id: 2, zone_name: 'Zone B', created_at: '2023-02-01', geojson: { type: 'FeatureCollection', features: [] }, model_planification: { maintenance: {}, repair: {} }, technicians: [] }
  ];

  beforeEach(() => {
    const zoneServiceSpy = jasmine.createSpyObj('ZoneService', ['get', 'delete'], { allZones: [] });
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['showToast']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['setLoading', 'showLoaderUntilCompleted']);

    TestBed.configureTestingModule({
      declarations: [LeafletListPage],
      providers: [
        { provide: ZoneService, useValue: zoneServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(LeafletListPage);
    component = fixture.componentInstance;
    
    mockZoneService = TestBed.inject(ZoneService) as jasmine.SpyObj<ZoneService>;
    mockLoadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('deleteSelected()', () => {
    beforeEach(() => {
      component.dataSource.data = [...mockZones];
    });

    it('should delete single zone by elementId', () => {
      const deleteResponse = { message: 'Zone deleted' };
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(deleteResponse));
      mockZoneService.delete.and.returnValue(of(deleteResponse as any));

      component.deleteSelected(1);

      expect(mockZoneService.delete).toHaveBeenCalledWith([1]);
      expect(component.deleted).toBe(true);
      expect(component.dataSource.data.length).toBe(1);
    });

    it('should delete multiple selected zones', () => {
      const deleteResponse = { message: 'Zones deleted' };
      mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(deleteResponse));
      mockZoneService.delete.and.returnValue(of(deleteResponse as any));
      component.selection.select(...mockZones);

      component.deleteSelected();

      expect(mockZoneService.delete).toHaveBeenCalledWith([1, 2]);
      expect(component.dataSource.data.length).toBe(0);
    });
  });


});