import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { Message, MessageService, MessageStatus } from 'src/app/services/message.service';
import { PlanningModelService } from 'src/app/services/planning-model.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PlanningModel } from 'src/app/models/planningModel';

@Component({
  selector: 'app-planning-models',
  templateUrl: './planning-models.page.html',
  styleUrls: ['./planning-models.page.scss'],
})
export class PlanningModelsPage implements OnInit {
  planningForm: FormGroup;
  displayedColumns: string[] = ['id', 'name'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSizes = [3, 6, 10, 15];
  selectedModel: PlanningModel | null = null;

  public planningService = inject(PlanningModelService)
  public messageService = inject(MessageService)
  public loaderService = inject(LoadingService)
  private route = inject(ActivatedRoute);

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.planningForm = this.fb.group({
      intervention_type: ['', Validators.required],
      name: ['', Validators.required],
      start_time: [null, [Validators.required, Validators.min(0)]],
      end_time: [null, [Validators.required, Validators.min(0)]],
      slot_duration: [null, [Validators.required, Validators.min(0)]],
      available_days: this.fb.group({
        monday: [false],
        tuesday: [false],
        wednesday: [false],
        thursday: [false],
        friday: [false],
        saturday: [false],
        sunday: [false]
      }, { validators: this.atLeastOneDaySelected })
    });

    this.planningService.get().then(models => {
      this.dataSource.data = models;
    });

    const modelId = this.route.snapshot.params['id'];
    if (modelId) {
      this.planningService.get().then(models => {
        const model = models.find(m => m.id === +modelId);
        if (model) {
          this.loadModelForEdit(model);
        }
      });
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  sortData(sort: any) {
    // Implement sorting logic similar to technician-list
  }

  /**
   * Valide qu'au moins un jour est sélectionné dans le formulaire
   * @param {AbstractControl} control - Contrôle du formulaire des jours
   * @returns {ValidationErrors | null} Erreur si aucun jour n'est sélectionné
   */
  atLeastOneDaySelected(control: AbstractControl): ValidationErrors | null {
    const days = control.value;
    const isAtLeastOneSelected = Object.values(days).some(value => value === true);
    return isAtLeastOneSelected ? null : { noDaySelected: false };
  }

  /**
   * Charge un modèle existant pour édition
   * @param {PlanningModel} model - Le modèle à charger
   */
  loadModelForEdit(model: PlanningModel) {
    this.selectedModel = model;

    // Convertit les heures en format décimal pour l'affichage
    const startTimeParts = model.start_time.split(':');
    const endTimeParts = model.end_time.split(':');

    const startTime = Number(startTimeParts[0]) + Number(startTimeParts[1]) / 60;
    const endTime = Number(endTimeParts[0]) + Number(endTimeParts[1]) / 60;

    const slotDuration = model.slot_duration.hours + (model.slot_duration.minutes || 0) / 60;
    this.planningForm.patchValue({
      intervention_type: model.intervention_type,
      name: model.name,
      start_time: startTime,
      end_time: endTime,
      slot_duration: slotDuration,
      available_days: model.available_days
    });
  }

  /**
   * Soumet le formulaire pour créer ou modifier un modèle de planification
   */
  onSubmit() {
    if (this.planningForm.valid) {
      if (this.selectedModel) {
        // Met à jour un modèle existant
        let modelData = this.planningForm.value;
        modelData.slot_duration = modelData.slot_duration + ' hours';
        const $resultObs = this.planningService.update({ id: this.selectedModel.id, ...modelData });
        const finalR = this.loaderService.showLoaderUntilCompleted($resultObs);
        finalR.subscribe({
          next: (result: any) => {
            console.log("Model updated:", result);
            this.messageService.showToast(result.message, Message.success);
            this.planningService.allPlanningModels = [];
          },
          error: (err) => {
            console.log("Error updating model:", err);
            this.messageService.showToast(err, Message.danger);
          }
        });
      } else {
        // Crée un nouveau modèle
        const slot_duration = this.planningForm.value.slot_duration + ' hours';
        this.planningForm.patchValue({ slot_duration });
        const resultObs$ = this.planningService.create(this.planningForm.value);
        const finalR = this.loaderService.showLoaderUntilCompleted(resultObs$);
        finalR.subscribe({
          next: (result: any) => {
            console.log("resultresult,", result);
            this.messageService.showToast(result.message, Message.success);
            this.planningService.allPlanningModels = [];
            this.planningForm.reset();
          },
          error: (err) => {
            console.log("errerrerr,", err);
            this.messageService.showToast(err, Message.danger);
          }
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }


}
