import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MessageService } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-admins-list',
  templateUrl: './admins-list.page.html',
  styleUrls: ['./admins-list.page.scss'],
})
export class AdminsListPage implements OnInit {

  adminService: AdminService = inject(AdminService);

  displayedColumns: string[] = ['select', 'id', 'last_name', 'first_name', 'actions'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  public messageService = inject(MessageService);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public loaderService = inject(LoadingService);
  @ViewChild('paginator') paginator: MatPaginator;
  pageSizes = [3, 6, 10, 15];
  adminsLoaded: Promise<boolean>;
  adminsLoadedResolver: (value: boolean) => void;

  constructor(public cd: ChangeDetectorRef) {
    this.adminsLoaded = new Promise((resolve) => {
      this.adminsLoadedResolver = resolve;
    });
  }

  ionViewWillEnter() {
    this.loaderService.setLoading(true);
    this.adminService.get().then(() => {
      this.dataSource.data = this.adminService.allAdmins;
      this.loaderService.setLoading(false);
      this.cd.detectChanges();
      this.adminsLoadedResolver(true);
    });
  }

  async ngAfterViewInit() {
    await this.adminsLoaded;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  deleteSelected(elementId?: number) {
    const selectedIds = elementId ? [elementId] : this.selection.selected.map(item => item.id);
    console.log('Deleting items with IDs:', selectedIds);
    const zoneRemoved$ = this.adminService.delete(selectedIds);
    const result = this.loaderService.showLoaderUntilCompleted(zoneRemoved$);
    result.subscribe({
      next: (response: any) => {
        console.log('Delete response:', response);
        this.dataSource.data = this.dataSource.data.filter(item => !selectedIds.includes(item.id));
        this.selection.clear();
        this.messageService.showToast(response.message, 'success');
      },
      error: message => {
        console.error('Delete error:', message);
        this.messageService.showToast(message, 'danger');
      }
    });
  }

  sortData(sort: any) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    const compare = (a: number | string, b: number | string, isAsc: boolean) => {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'first_name':
          return compare(a.first_name, b.first_name, isAsc);
        case 'last_name':
          return compare(a.last_name, b.last_name, isAsc);
        case 'id':
          return compare(a.id, b.id, isAsc);
        default:
          return 0;
      }
    });
  }
}
