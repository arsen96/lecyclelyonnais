import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { PlanningModelService } from 'src/app/services/planning-model.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PlanningModel } from '../../models/planningModel';
import { SelectionModel } from '@angular/cdk/collections';
import { MessageService } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-planning-models-list',
  templateUrl: './planning-models-list.page.html',
  styleUrls: ['./planning-models-list.page.scss'],
})
export class PlanningModelsListPage  {
  displayedColumns: string[] = ['select', 'id', 'name', 'intervention_type', 'time', 'available_days', 'actions'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public loaderService: LoadingService = inject(LoadingService);
  public messageService: MessageService = inject(MessageService);
  pageSizes = [3, 6, 10, 15];

  public planningModelService: PlanningModelService = inject(PlanningModelService);

  constructor() { }


  ionViewWillEnter() {
    this.loaderService.setLoading(true);
    this.planningModelService.getPlanningModels().then(models => {
      console.log("models", models);
      this.dataSource.data = models;
      this.loaderService.setLoading(false);
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
        case 'id':
          return compare(a.id, b.id, isAsc);
        default:
          return 0;
      }
    });
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
    const zoneRemoved$ = this.planningModelService.deletePlanningModel(selectedIds);
    const result = this.loaderService.showLoaderUntilCompleted(zoneRemoved$);
    result.subscribe({
      next: (response: any) => {
        console.log('Delete response:', response);
        this.dataSource.data = this.dataSource.data.filter(item => !selectedIds.includes(item.id));
        this.messageService.showToast(response.message, 'success'); 
      },
      error: message => {
        console.error('Delete error:', message);
        this.messageService.showToast(message, 'danger'); 
      }
    });
  }


  getAvailableDays(days: any): string {
    const dayNames = {
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche'
    };

    return Object.keys(days)
      .filter(day => days[day])
      .map(day => dayNames[day])
      .join(', ');
  }
}
