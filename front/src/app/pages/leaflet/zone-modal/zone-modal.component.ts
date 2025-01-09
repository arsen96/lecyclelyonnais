import { Component, inject, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MessageService } from 'src/app/services/message.service';
import { PlanningModelService } from 'src/app/services/planning-model.service';
@Component({
  selector: 'app-zone-modal',
  templateUrl: './zone-modal.component.html',
  styleUrls: ['./zone-modal.component.scss'],
})
export class ZoneModalComponent {
  @Input() zoneSelected: any;
  @Input() edition: boolean = false;
  zoneTitle: string;
  zoneTypeInterventionMaintenance: string;
  zoneTypeInterventionRepair: string;
  planningModels: any[] = [];
  

  public messageService: MessageService = inject(MessageService);
  public planningModelService: PlanningModelService = inject(PlanningModelService);

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.planningModelService.get().then((data: any) => {
        this.planningModels = this.planningModelService.allPlanningModels;

        if(this.edition){
          this.zoneTitle = this.zoneSelected.zone_name;
          this.zoneTypeInterventionMaintenance = this.zoneSelected.model_planification.maintenance.id;
          this.zoneTypeInterventionRepair = this.zoneSelected.model_planification.repair.id;

        }
    });
  }

  dismiss(data?: any, role: string = 'cancel') {
    this.modalController.dismiss(data, role);
  }

  validate() {
    if (!this.zoneTypeInterventionMaintenance || !this.zoneTypeInterventionRepair || !this.zoneTitle) {
        this.messageService.showToast("Veuillez renseigner tous les champs", "danger");   
      return;
    }
    this.dismiss({
      zoneTitle: this.zoneTitle,
      zoneTypeInterventionMaintenance: this.zoneTypeInterventionMaintenance,
      zoneTypeInterventionRepair: this.zoneTypeInterventionRepair,
    });
  }
} 