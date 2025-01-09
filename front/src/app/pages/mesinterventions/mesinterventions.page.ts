import { Component, inject, OnInit } from '@angular/core';
import { Intervention } from 'src/app/models/intervention';
import { GlobalService } from 'src/app/services/global.service';
import { InterventionService } from 'src/app/services/intervention.service';
import { Message, MessageService } from 'src/app/services/message.service';
import { ModalController, AlertController } from '@ionic/angular';
import { ImageModalComponent } from 'src/app/components/image-modal/image-modal.component';
import { LoadingService } from 'src/app/services/loading.service';
import { BaseService } from 'src/app/services/base.service';


export enum FilterType {
  PAST = 'past',
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing'
}

@Component({
  selector: 'app-mesinterventions',
  templateUrl: './mesinterventions.page.html',
  styleUrls: ['./mesinterventions.page.scss'],
})


export class MesinterventionsPage implements OnInit {

  public interventionService = inject(InterventionService)
  public globalService = inject(GlobalService)  
  public loadingService = inject(LoadingService)  
  public messageService = inject(MessageService)

  technicianInterventions:Intervention[] = [];  
  pastInterventions: Intervention[] = [];
  upcomingInterventions: Intervention[] = [];
  ongoingInterventions: Intervention[] = [];
  newComment: string = '';
  startDate: string = '';
  endDate: string = '';
  isFilterApplied: boolean = false;
  isFilterAppliedOngoing: boolean = false;
  isFilterAppliedUpcoming: boolean = false;
  isFilterAppliedPast: boolean = false;

  selectedTypePast: string = '';
  selectedTypeOngoing: string = '';
  selectedTypeUpcoming: string = '';


  public displayPastInterventions: boolean = true;
  public displayOngoingInterventions: boolean = true;
  public displayUpcomingInterventions: boolean = true;

  public get FilterType() {
    return FilterType;
  }

  async ionViewWillEnter() {
    const success = await this.interventionService.interventionsLoaded;
    if (success) {
      this.technicianInterventions = this.interventionService.getInterventionsByTechnician(this.globalService.user.getValue().id);
      const now = new Date();
      this.pastInterventions = this.technicianInterventions.filter(intervention => new Date(intervention.appointment_end) < now || intervention.status === 'completed' || intervention.status === 'canceled');
      this.ongoingInterventions = this.technicianInterventions.filter(intervention => {
        const start = new Date(intervention.appointment_start);
        const end = new Date(intervention.appointment_end);
        const isOngoing = start <= now && end >= now && intervention.status !== 'completed';
        return isOngoing;
      });

      this.upcomingInterventions = this.technicianInterventions.filter(intervention => {
        const isUpcoming = new Date(intervention.appointment_start) > now && intervention.status !== 'canceled';
        const isNotInPast = !this.pastInterventions.some(pastIntervention => pastIntervention.id === intervention.id);
        return isUpcoming && isNotInPast;
      });
    
      
      this.displayPastInterventions = this.pastInterventions.length > 0;
      this.displayOngoingInterventions = this.ongoingInterventions.length > 0;
      this.displayUpcomingInterventions = this.upcomingInterventions.length > 0;
    }
  }

  constructor(private modalController: ModalController, private alertController: AlertController) { }

  ngOnInit() {
  }

  async openImageModal(photos: string[], index: number) {
    photos = photos.map(photo => BaseService.baseApi + '/'+ photo);
    const modal = await this.modalController.create({
      component: ImageModalComponent,
      componentProps: {
        photos,
        index
      }
    });
    return await modal.present();
  }

  async confirmCancel(intervention: Intervention) {
    const alert = await this.alertController.create({
      header: "Confirmer l'annulation",
      message: "Voulez-vous vraiment annuler ce rendez-vous ?",
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          
          }
        }, {
          text: 'Oui',
          handler: () => {
            this.cancelIntervention(intervention);
          }
        }
      ]
    });

    await alert.present();
  }

  cancelIntervention(intervention: Intervention) {
    console.log('Intervention annulée:', intervention);
    const obs$ = this.interventionService.manageEndIntervention(intervention.id, true, this.newComment);
    this.loadingService.showLoaderUntilCompleted(obs$).subscribe({
        next: (response: any) => {
          this.messageService.showToast(response.message, Message.success);
          // this.technicianInterventions = this.technicianInterventions.filter(i => i.id !== intervention.id);
          intervention.status = 'canceled';
          this.updateInterventionLists();
        },
        error: (err: any) => {
          this.messageService.showToast(err, Message.danger);
        }
    });
  }


  onFileSelected(event: Event, intervention: Intervention) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      const newPhotos = files.map(file => URL.createObjectURL(file));
      intervention.uploadedPhotos = intervention.uploadedPhotos ? [...intervention.uploadedPhotos, ...newPhotos] : newPhotos;
    }
  }

  removePhoto(intervention: Intervention, index: number) {
    intervention.uploadedPhotos.splice(index, 1);
  }

  filterInterventionsByType(type: string) {
    return this.technicianInterventions.filter(intervention => intervention.type === type);
  }


  async markAsDone(intervention: Intervention) {
    const photos = await this.getSelectedPhotos(intervention);
    const obs$ = this.interventionService.manageEndIntervention(intervention.id, false, this.newComment, photos);
    this.loadingService.showLoaderUntilCompleted(obs$).subscribe({
      next: (response: any) => {
        this.messageService.showToast(response.message, Message.success);
        intervention.status = 'completed';
        this.updateInterventionLists();
      },
      error: (err: any) => {
        this.messageService.showToast(err, Message.danger);
      }
    });
  }

  async getSelectedPhotos(intervention: Intervention): Promise<File[]> {
    const photoPromises = intervention.uploadedPhotos.map(async (photoUrl) => {
        const response = await fetch(photoUrl);
        const blob = await response.blob();
        const mimeType = blob.type;
        const extension = mimeType.split('/').pop(); 
        const fileName = `${photoUrl.split('/').pop() || 'photo'}.${extension}`;
        return new File([blob], fileName, { type: mimeType });
    });

    return Promise.all(photoPromises);
  }

  private updateInterventionLists() {
    const now = new Date();
    this.pastInterventions = this.technicianInterventions.filter(intervention => new Date(intervention.appointment_end) < now || intervention.status === 'completed' || intervention.status === 'canceled');
    this.ongoingInterventions = this.technicianInterventions.filter(intervention => {
        const start = new Date(intervention.appointment_start);
        const end = new Date(intervention.appointment_end);
        const isOngoing = start <= now && end >= now && intervention.status !== 'completed';
        return isOngoing;
    });
    this.upcomingInterventions = this.technicianInterventions.filter(intervention => {
      const isUpcoming = new Date(intervention.appointment_start) > now && intervention.status !== 'canceled';
      const isNotInPast = !this.pastInterventions.some(pastIntervention => pastIntervention.id === intervention.id);
      return isUpcoming && isNotInPast;
    });
    this.displayPastInterventions = this.pastInterventions.length > 0;
    this.displayOngoingInterventions = this.ongoingInterventions.length > 0;
    this.displayUpcomingInterventions = this.upcomingInterventions.length > 0;
  }

  filterInterventions(filterType: string) {
    const now = new Date();

    if(filterType === FilterType.PAST){ 
        this.pastInterventions = this.technicianInterventions.filter(intervention => {
          const interventionEnd = new Date(intervention.appointment_end);
        const matchesType = this.selectedTypePast ? intervention.type === this.selectedTypePast : true;
        return (interventionEnd < now || intervention.status === 'completed' || intervention.status === 'canceled') && matchesType;
      });

      this.isFilterAppliedPast = this.selectedTypePast !== '';
    }

    if(filterType === FilterType.ONGOING){

      console.log("this.selectedTypeOngoing", this.selectedTypeOngoing);
    this.ongoingInterventions = this.technicianInterventions.filter(intervention => {
      const interventionStart = new Date(intervention.appointment_start);
      const interventionEnd = new Date(intervention.appointment_end);
      const isOngoing = interventionStart <= now && interventionEnd >= now && intervention.status !== 'completed';
      const matchesType = this.selectedTypeOngoing ? intervention.type === this.selectedTypeOngoing : true;
        return isOngoing && matchesType;
      });
      this.isFilterAppliedOngoing = this.selectedTypeOngoing !== '';
      
    }

    if(filterType === FilterType.UPCOMING){
      console.log("this.selectedTypeUpcoming", this.selectedTypeUpcoming);
    this.upcomingInterventions = this.technicianInterventions.filter(intervention => {
      const interventionStart = new Date(intervention.appointment_start);
      const matchesType = this.selectedTypeUpcoming ? intervention.type === this.selectedTypeUpcoming : true;
      return interventionStart > now && intervention.status !== 'canceled' && matchesType;
      });

      this.isFilterAppliedOngoing = this.selectedTypeUpcoming !== '';
    }
  }

}
