import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { TechnicianService } from 'src/app/services/technician.service';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ZoneService } from 'src/app/services/zone.service';
import { MessageService, MessageStatus } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-technician-list',
  templateUrl: './technician-list.page.html',
  styleUrls: ['./technician-list.page.scss'],
})
export class TechnicianListPage implements OnInit {

  technicianService: TechnicianService = inject(TechnicianService)

  displayedColumns: string[] = ['select', 'id', 'last_name', 'first_name', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  public messageService = inject(MessageService);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public loaderService = inject(LoadingService);
  constructor(
  ) {}

  ionViewWillEnter() {
    this.technicianService.get().then(res => {
      this.dataSource.data = res;
    });
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

  deleteSelected(elementId?:number) {
    const selectedIds = elementId ? [elementId] : this.selection.selected.map(item => item.id);
    console.log('Deleting items with IDs:', selectedIds);
    // const zoneRemoved$ = this.technicianService.delete(selectedIds);
    // const result = this.loaderService.showLoaderUntilCompleted(zoneRemoved$);
    // result.subscribe({
    //   next: (response: any) => {
    //     console.log('Delete response:', response);
    //     this.dataSource.data = this.dataSource.data.filter(item => !selectedIds.includes(item.id));
    //     this.selection.clear();
    //     this.messageService.showToast(response.message, 'success'); 
    //   },
    //   error: message => {
    //     console.error('Delete error:', message);
    //     this.messageService.showToast(message, 'danger'); 
    //   }
    // });
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
}
