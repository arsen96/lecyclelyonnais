import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ImageModalComponent } from 'src/app/components/image-modal/image-modal.component';
import { Intervention } from 'src/app/models/intervention';
import { BaseService } from 'src/app/services/base.service';
import { GlobalService } from 'src/app/services/global.service';
import { InterventionService } from 'src/app/services/intervention.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Message, MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-interventions',
  templateUrl: './interventions.page.html',
  styleUrls: ['./interventions.page.scss'],
})
export class InterventionsPage implements OnInit {

  public interventionService = inject(InterventionService)
  public router = inject(Router)
  public globalService = inject(GlobalService)
  public messageService = inject(MessageService)
  public modalController = inject(ModalController)  
  userInterventions: Intervention[] = [];
  pastInterventions: Intervention[] = [];
  upcomingInterventions: Intervention[] = [];

  public loadingService = inject(LoadingService)

  constructor() { }

  async ngOnInit() {

  }

  async ionViewWillEnter(){
    const success = await this.interventionService.interventionsLoaded;
    if (!success) {
      this.messageService.showToast("Une erreur est survenue lors du chargement des interventions", Message.danger);
      this.router.navigate(['/login']);
      return;
    }
    const user = this.globalService.user.getValue();
    console.log("user", user.id)

    console.log("this.allInterventions",this.interventionService.allInterventions)
    this.userInterventions = await this.interventionService.getInterventionsByUser(this.globalService.user.getValue().id);
    const now = new Date();
    this.pastInterventions = this.userInterventions.filter(intervention => new Date(intervention.appointment_end) < now || intervention.status === 'completed' || intervention.status === 'canceled');
    this.upcomingInterventions = this.userInterventions.filter(intervention => {
      const isUpcom = new Date(intervention.appointment_end) >= now;
      const isPast = this.pastInterventions.some(item => item.id === intervention.id);
      return isUpcom && !isPast
    });
    console.log("this.upcomingInterventions",this.upcomingInterventions)
  }

  confirmCancel(intervention){
    this.cancelIntervention(intervention);
  }

  cancelIntervention(intervention: Intervention) {
    console.log('Intervention annulée:', intervention);
    const obs$ = this.interventionService.manageEndIntervention(intervention.id, true, null);
    this.loadingService.showLoaderUntilCompleted(obs$).subscribe({
        next: (response: any) => {
          this.messageService.showToast(response.message, Message.success);
          // this.interventionService.allInterventions = this.interventionService.allInterventions.filter((uI) => uI.id != intervention.id);
          // this.pastInterventions = this.userInterventions.filter((uI) => uI.id !== intervention.id);
          this.pastInterventions.push(intervention)
          this.upcomingInterventions = this.upcomingInterventions.filter((uI) => uI.id !== intervention.id);
        },
        error: (err: any) => {
          this.messageService.showToast(err, Message.danger);
        }
    });
  }

  async openImageModal(photos: string[], index: number) {
    photos = photos.map(photo => BaseService.baseApi + '/' + photo);
    const modal = await this.modalController.create({
      component: ImageModalComponent,
      componentProps: {
        photos,
        index
      }
    });
    return await modal.present();
  }   
}
