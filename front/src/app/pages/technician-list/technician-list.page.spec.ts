// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatTableDataSource } from '@angular/material/table';
// import { SelectionModel } from '@angular/cdk/collections';
// import { of, throwError } from 'rxjs';

// import { TechnicianListPage } from './technician-list.page';
// import { TechnicianService } from 'src/app/services/technician.service';
// import { MessageService } from 'src/app/services/message.service';
// import { LoadingService } from 'src/app/services/loading.service';

// describe('TechnicianListPage', () => {
//   let component: TechnicianListPage;
//   let fixture: ComponentFixture<TechnicianListPage>;
//   let mockTechnicianService: jasmine.SpyObj<TechnicianService>;
//   let mockMessageService: jasmine.SpyObj<MessageService>;
//   let mockLoadingService: jasmine.SpyObj<LoadingService>;

//   const mockTechnicians = [
//     {
//       id: 1,
//       first_name: 'John',
//       last_name: 'Doe',
//       email: 'john@example.com',
//       phone: '0123456789',
//       address: '123 Main St',
//       created_at: '2023-01-01',
//       is_available: true,
//       geographical_zone_id: 1
//     },
//     {
//       id: 2,
//       first_name: 'Jane',
//       last_name: 'Smith',
//       email: 'jane@example.com',
//       phone: '0987654321',
//       address: '456 Oak Ave',
//       created_at: '2023-02-01',
//       is_available: true,
//       geographical_zone_id: 2
//     }
//   ];

//   beforeEach(() => {
//     const technicianServiceSpy = jasmine.createSpyObj('TechnicianService', ['get', 'delete']);
//     const messageServiceSpy = jasmine.createSpyObj('MessageService', ['showToast']);
//     const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['setLoading', 'showLoaderUntilCompleted']);

//     TestBed.configureTestingModule({
//       declarations: [TechnicianListPage],
//       providers: [
//         { provide: TechnicianService, useValue: technicianServiceSpy },
//         { provide: MessageService, useValue: messageServiceSpy },
//         { provide: LoadingService, useValue: loadingServiceSpy }
//       ]
//     });

//     fixture = TestBed.createComponent(TechnicianListPage);
//     component = fixture.componentInstance;
    
//     mockTechnicianService = TestBed.inject(TechnicianService) as jasmine.SpyObj<TechnicianService>;
//     mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
//     mockLoadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });


//   describe('deleteSelected()', () => {
//     beforeEach(() => {
//       component.dataSource.data = [...mockTechnicians];
//     });

//     it('should delete single technician by elementId', () => {
//       const deleteResponse = { message: 'Technician deleted successfully' };
//       mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(deleteResponse));
//       mockTechnicianService.delete.and.returnValue(of(deleteResponse as any));

//       component.deleteSelected(1);

//       expect(mockTechnicianService.delete).toHaveBeenCalledWith([1]);
//       expect(component.dataSource.data.length).toBe(1);
//       expect(component.dataSource.data.find(t => t.id === 1)).toBeUndefined();
//       expect(component.selection.selected.length).toBe(0);
//       expect(mockMessageService.showToast).toHaveBeenCalledWith('Technician deleted successfully', 'success');
//     });

//     it('should delete multiple selected technicians', () => {
//       const deleteResponse = { message: 'Technicians deleted successfully' };
//       mockLoadingService.showLoaderUntilCompleted.and.returnValue(of(deleteResponse));
//       mockTechnicianService.delete.and.returnValue(of(deleteResponse as any));
//       component.selection.select(mockTechnicians[0], mockTechnicians[1]);

//       component.deleteSelected();

//       expect(mockTechnicianService.delete).toHaveBeenCalledWith([1, 2]);
//       expect(component.dataSource.data.length).toBe(0);
//       expect(component.selection.selected.length).toBe(0);
//       expect(mockMessageService.showToast).toHaveBeenCalledWith('Technicians deleted successfully', 'success');
//     });

//     it('should handle delete errors', () => {
//       const errorMessage = 'Delete failed';
//       mockLoadingService.showLoaderUntilCompleted.and.returnValue(throwError(() => errorMessage));
//       spyOn(console, 'error');

//       component.deleteSelected(1);

//       expect(console.error).toHaveBeenCalledWith('Delete error:', errorMessage);
//       expect(mockMessageService.showToast).toHaveBeenCalledWith(errorMessage, 'danger');
//     });

//   });



//   describe('Component initialization', () => {
//     it('should initialize displayedColumns correctly', () => {
//       expect(component.displayedColumns).toEqual([
//         'select', 'id', 'last_name', 'first_name', 'created_at', 'actions'
//       ]);
//     });

//     it('should initialize dataSource as MatTableDataSource', () => {
//       expect(component.dataSource).toBeInstanceOf(MatTableDataSource);
//     });

//     it('should initialize selection as SelectionModel', () => {
//       expect(component.selection).toBeInstanceOf(SelectionModel);
//       expect(component.selection.isMultipleSelection()).toBe(true);
//     });

//     it('should initialize pageSizes correctly', () => {
//       expect(component.pageSizes).toEqual([3, 6, 10, 15]);
//     });

//     it('should create techniciansLoaded promise', () => {
//       expect(component.techniciansLoaded).toBeInstanceOf(Promise);
//       expect(component.techniciansLoadedResolver).toBeInstanceOf(Function);
//     });

//     it('should inject TechnicianService correctly', () => {
//       expect(component.technicianService).toBeDefined();
//     });
//   });

//   describe('ngOnInit()', () => {
//     it('should be defined but empty (no implementation)', () => {
//       expect(component.ngOnInit).toBeDefined();
      
//       // Appeler ngOnInit ne devrait rien faire de spécial
//       expect(() => component.ngOnInit()).not.toThrow();
//     });
//   });
// });