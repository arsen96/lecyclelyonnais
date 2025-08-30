import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
// Importez le service de gestion des vélos
import { BicycleService } from 'src/app/services/bicycle.service';
import { MessageService } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-bikes-list',
  templateUrl: './bikes-list.page.html',
  styleUrls: ['./bikes-list.page.scss'],
})
export class BikesListPage implements OnInit {

  bikeService: BicycleService = inject(BicycleService);

  displayedColumns: string[] = ['select', 'id', 'model', 'brand', 'actions'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  public messageService = inject(MessageService);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public loaderService = inject(LoadingService);
  @ViewChild('paginator') paginator: MatPaginator;
  pageSizes = [3, 6, 10, 15];
  bikesLoaded: Promise<boolean>;
  bikesLoadedResolver: (value: boolean) => void;

  constructor(public cd: ChangeDetectorRef) {
    this.bikesLoaded = new Promise((resolve) => {
      this.bikesLoadedResolver = resolve;
    });
  }

  ionViewWillEnter() {
    this.loaderService.setLoading(true);
    this.bikeService.getUserBicycles().subscribe(res => {
      this.dataSource.data = res;
      this.loaderService.setLoading(false);
      this.cd.detectChanges();
      this.bikesLoadedResolver(true);
    });
  }

  async ngAfterViewInit() {
    await this.bikesLoaded;
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
    const zoneRemoved$ = this.bikeService.delete(selectedIds);
    const result = this.loaderService.showLoaderUntilCompleted(zoneRemoved$); 
    result.subscribe({
      next: (response: any) => {
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
        case 'model':
          return compare(a.model, b.model, isAsc);
        case 'brand':
          return compare(a.brand, b.brand, isAsc);
        case 'created_at':
          return compare(a.created_at, b.created_at, isAsc);
        case 'id':
          return compare(a.id, b.id, isAsc);
        default:
          return 0;
      }
    });
  }
}
