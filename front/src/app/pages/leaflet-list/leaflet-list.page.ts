import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ZoneService } from 'src/app/services/zone.service';
import { MessageService, MessageStatus } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-leaflet-list',
  templateUrl: './leaflet-list.page.html',
  styleUrls: ['./leaflet-list.page.scss'],
})
export class LeafletListPage implements OnInit {
  displayedColumns: string[] = ['select', 'id', 'zone_name', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  public messageService = inject(MessageService);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public loaderService = inject(LoadingService);
  @ViewChild('paginator') paginator: MatPaginator;
  pageSizes = [3, 6, 10, 15];
  pageSize = 10;
  pageIndex = 0;
  totalItems = 0;
  leafletLoaded: Promise<boolean>;
  leafletLoadedResolver: (value: boolean) => void;
  deleted = false;
  errorOccured = false;
  constructor(
    public zoneService: ZoneService,
    public cd: ChangeDetectorRef
  ) {
    this.leafletLoaded = new Promise((resolve) => {
      this.leafletLoadedResolver = resolve;
    }); 
  }

  ionViewWillEnter() {
    this.deleted = false;
    this.errorOccured = false;
    this.loaderService.setLoading(true);
    this.zoneService.get().then(zones => {
      this.dataSource.data = zones;
      this.totalItems = zones.length;
      this.cd.detectChanges();
      this.leafletLoadedResolver(true);
      this.loaderService.setLoading(false);
    }).catch(error => {
      this.messageService.showToast("Erreur lors du chargement des zones", 'danger');
      this.errorOccured = true;
      this.loaderService.setLoading(false);
    });
  }

  ngOnInit() {}

  async ngAfterViewInit() {
    await this.leafletLoaded;
    this.dataSource.paginator = this.paginator;
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

  deleteSelected(elementId?:number) {
    const selectedIds = elementId ? [elementId] : this.selection.selected.map(item => item.id);
    console.log('Deleting items with IDs:', selectedIds);
    const zoneRemoved$ = this.zoneService.delete(selectedIds);
    const result = this.loaderService.showLoaderUntilCompleted(zoneRemoved$);
    result.subscribe({
      next: (response: any) => {
        this.deleted = true;
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

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    const compare = (a: number | string, b: number | string, isAsc: boolean) => {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'zone_name':
          return compare(a.zone_name, b.zone_name, isAsc);
        case 'created_at':
          return compare(a.created_at, b.created_at, isAsc);
        case 'id':
          return compare(a.id, b.id, isAsc);
        default:
          return 0;
      }
    });
  }

  pageChanged(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }

  updateDataSource() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    // this.dataSource.data = this.zoneService.get().slice(startIndex, endIndex);
  }

  ionViewWillLeave(){
    if(this.deleted){
      this.zoneService.allZones = new Array();
    }
  }
}
