import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MessageService } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.page.html',
  styleUrls: ['./company-list.page.scss'],
})
export class CompanyListPage implements OnInit {

  companyService: CompanyService = inject(CompanyService)

  displayedColumns: string[] = ['select', 'name', 'subdomain', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  public messageService = inject(MessageService);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public loaderService = inject(LoadingService);
  @ViewChild('paginator') paginator: MatPaginator;
  pageSizes = [3, 6, 10, 15];
  companiesLoaded: Promise<boolean>;
  companiesLoadedResolver: (value: boolean) => void;
  constructor(public cd:ChangeDetectorRef) {
    this.companiesLoaded = new Promise((resolve) => {
      this.companiesLoadedResolver = resolve;
    }); 
  }

  ionViewWillEnter() {
    this.loaderService.setLoading(true);
    this.companyService.getCompanies().then(res => {
      this.dataSource.data = res;
      this.loaderService.setLoading(false);
      this.cd.detectChanges();
      this.companiesLoadedResolver(true);
    });
  }

  async ngAfterViewInit() {
    await this.companiesLoaded;
     this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {

  }

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
    const companyRemoved$ = this.companyService.delete(selectedIds);
    const result = this.loaderService.showLoaderUntilCompleted(companyRemoved$);
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
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'subdomain':
          return compare(a.subdomain, b.subdomain, isAsc);
        case 'created_at':
          return compare(a.created_at, b.created_at, isAsc);
        default:
          return 0;
      }
    });
  }
}
