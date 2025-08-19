import { ChangeDetectorRef, Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Technician } from 'src/app/models/technicians';
import { TechnicianService } from 'src/app/services/technician.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Zones } from 'src/app/models/zones';
import { MessageService } from 'src/app/services/message.service';
import { ZoneService } from 'src/app/services/zone.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-technician-modal',
  templateUrl: './technician-modal.component.html',
  styleUrls: ['./technician-modal.component.scss'],
})
export class TechnicianModalComponent implements OnInit {
  @Input() technicians: Technician[] = [];
  dataSource = new MatTableDataSource<Technician>();
  displayedColumns: string[] = ['select', 'first_name', 'last_name', 'action'];
  pageSizes = [3, 6, 10, 15];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  techniciansLoaded: Promise<boolean>;
  techniciansLoadedResolver: (value: boolean) => void;
  selection = new SelectionModel<any>(true, []);
  @Input() zoneId: number;
  @Input() currentZone: Zones;
  messageService: MessageService = inject(MessageService);
  constructor(private modalController: ModalController, public technicianService: TechnicianService,public cd:ChangeDetectorRef,public zoneService:ZoneService) {
    this.techniciansLoaded = new Promise((resolve) => {
      this.techniciansLoadedResolver = resolve;
    }); 
  }

  ngOnInit() {
      const elemens = this.technicians.filter(t => !t.geographical_zone_id);
      this.technicians = elemens;
      this.dataSource.data = elemens;
      this.updateTechnicians();
      this.cd.detectChanges();
      this.techniciansLoadedResolver(true);
  }

  async ngAfterViewInit() {
    await this.techniciansLoaded;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public updateTechnicians(){
    this.technicians = this.technicians.filter(technician => {
      return technician.geographical_zone_id === null;
    });
  }

  manageSelected(id: number | number[]) {
    let ids = Array.isArray(id) ? id : [id];
      this.zoneService.addTechnicianToZone(this.zoneId,ids).subscribe(res => {
        ids.forEach(id => {  
          const currentTechnician = this.technicians.find(t => t.id === id);
          this.currentZone.technicians.push({id:currentTechnician.id,first_name:currentTechnician.first_name,last_name:currentTechnician.last_name});
          this.dataSource.data = this.dataSource.data.filter(t => t.id !== id);
        }) 
        this.messageService.showToast(res.message, 'success');
        this.selection.clear();
        this.updateTechnicians();
      },error => {
        this.messageService.showToast(error, 'danger');
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  dismiss() {
    this.modalController.dismiss();
  }

  addMultipleTechnicians(){
    console.log("addMultipleTechnicians",this.selection.selected)
    const ids = this.selection.selected.map(t => t.id);
    this.manageSelected(ids);
  }
} 
