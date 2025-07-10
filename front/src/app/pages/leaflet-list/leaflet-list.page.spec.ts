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
  let mockMessageService: jasmine.SpyObj<MessageService>;
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
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    mockLoadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter()', () => {
    it('should load zones and populate dataSource', async () => {
      mockZoneService.get.and.returnValue(Promise.resolve(mockZones as any));

      await component.ionViewWillEnter();

      expect(mockZoneService.get).toHaveBeenCalled();
      expect(component.dataSource.data).toEqual(mockZones);
      expect(component.deleted).toBe(false);
    });
  });

  describe('ngAfterViewInit()', () => {
    it('should set paginator after zones are loaded', async () => {
      component.leafletLoadedResolver(true);
      
      await component.ngAfterViewInit();
      
      expect(component.dataSource.paginator).toBe(component.paginator);
    });
  });

  describe('applyFilter()', () => {
    it('should filter dataSource correctly', () => {
      const mockEvent = { target: { value: '  Zone A  ' } } as any;
      
      component.applyFilter(mockEvent);
      
      expect(component.dataSource.filter).toBe('zone a');
    });
  });

  describe('isAllSelected()', () => {
    it('should return true when all items are selected', () => {
      component.dataSource.data = mockZones;
      component.selection.select(...mockZones);

      expect(component.isAllSelected()).toBe(true);
    });

    it('should return false when not all items are selected', () => {
      component.dataSource.data = mockZones;
      
      expect(component.isAllSelected()).toBe(false);
    });
  });

  describe('masterToggle()', () => {
    it('should select all items when none are selected', () => {
      component.dataSource.data = mockZones;
      
      component.masterToggle();
      
      expect(component.selection.selected.length).toBe(2);
    });

    it('should clear selection when all items are selected', () => {
      component.dataSource.data = mockZones;
      component.selection.select(...mockZones);
      
      component.masterToggle();
      
      expect(component.selection.selected.length).toBe(0);
    });
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

  describe('sortData()', () => {
    beforeEach(() => {
      component.dataSource.data = [
        { id: 2, zone_name: 'Zone B', created_at: '2023-02-01' },
        { id: 1, zone_name: 'Zone A', created_at: '2023-01-01' }
      ] as any[];
    });

    it('should sort by zone_name ascending', () => {
      component.sortData({ active: 'zone_name', direction: 'asc' });

      expect(component.dataSource.data[0].zone_name).toBe('Zone A');
    });

    it('should not sort when direction is empty', () => {
      const originalData = [...component.dataSource.data];

      component.sortData({ active: 'zone_name', direction: '' });

      expect(component.dataSource.data).toEqual(originalData);
    });
  });

  describe('pageChanged()', () => {
    it('should update pageIndex and pageSize', () => {
      const mockEvent = { pageIndex: 2, pageSize: 15 } as any;

      component.pageChanged(mockEvent);

      expect(component.pageIndex).toBe(2);
      expect(component.pageSize).toBe(15);
    });
  });

});