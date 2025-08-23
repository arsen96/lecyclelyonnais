import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BikesListPage } from './bikes-list.page';
import { BicycleService } from 'src/app/services/bicycle.service';
import { MessageService } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';

import { 
  BicycleFactory, 
  createServiceSpy,
  createLoadingServiceSpy,
  createMessageServiceSpy,
  TEST_CONSTANTS
} from '../../../../test-fixtures';

describe('BikesListPage', () => {
  let component: BikesListPage;
  let fixture: ComponentFixture<BikesListPage>;
  let mockBicycleService: jasmine.SpyObj<BicycleService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  const mockBikes = BicycleFactory.createMultiple(2);

  beforeEach(() => {
    mockBicycleService = createServiceSpy('BicycleService', ['getUserBicycles', 'delete']) as jasmine.SpyObj<BicycleService>;
    mockMessageService = createMessageServiceSpy();
    mockLoadingService = createLoadingServiceSpy();

    TestBed.configureTestingModule({
      declarations: [BikesListPage],
      providers: [
        { provide: BicycleService, useValue: mockBicycleService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: ChangeDetectorRef, useValue: jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(BikesListPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should initialize data structures correctly', () => {
      expect(component.dataSource).toBeInstanceOf(MatTableDataSource);
      expect(component.selection).toBeInstanceOf(SelectionModel);
      expect(component.selection.isMultipleSelection()).toBe(true);
      
      // CORRECTION: Ordre des colonnes selon le code réel
      expect(component.displayedColumns).toEqual(['select', 'id', 'model', 'brand', 'actions']);
      expect(component.pageSizes).toEqual(TEST_CONSTANTS.PAGINATION.PAGE_SIZES);
    });
  });



  describe('Lifecycle methods', () => {
    it('should have ngOnInit defined but empty', () => {
      expect(component.ngOnInit).toBeDefined();
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should resolve bikes loaded promise', (done) => {
      mockBicycleService.getUserBicycles.and.returnValue(of(mockBikes));

      component.bikesLoaded.then((result) => {
        expect(result).toBe(true);
        done();
      });

      component.ionViewWillEnter();
    });
  });


});