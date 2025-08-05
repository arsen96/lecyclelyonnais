import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ImageModalComponent } from 'src/app/components/image-modal/image-modal.component';
import { Intervention } from 'src/app/models/intervention';
import { BaseService } from 'src/app/services/base.service';
import { GlobalService } from 'src/app/services/global.service';
import { InterventionService } from 'src/app/services/intervention.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Message, MessageService } from 'src/app/services/message.service';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-interventions',
  templateUrl: './interventions.page.html',
  styleUrls: ['./interventions.page.scss'],
})
export class InterventionsPage implements OnInit, OnDestroy {

  public interventionService = inject(InterventionService)
  public router = inject(Router)
  public globalService = inject(GlobalService)
  public messageService = inject(MessageService)
  public modalController = inject(ModalController)  
  userInterventions: Intervention[] = [];
  pastInterventions: Intervention[] = [];
  upcomingInterventions: Intervention[] = [];

  public loadingService = inject(LoadingService)
  private userSubscription: Subscription;

  constructor() { }

  async ngOnInit() {

  }

  /**
   * Charge les interventions de l'utilisateur et les trie par période
   * Attend que l'utilisateur soit disponible avant de charger les données
   */
  async ionViewWillEnter(){
    const success = await this.interventionService.interventionsLoaded;
    if (!success) {
      this.messageService.showToast("Une erreur est survenue lors du chargement des interventions", Message.danger);
      this.router.navigate(['/login']);
      return;
    }

    // Attend que l'utilisateur soit disponible
    this.userSubscription = this.globalService.user.pipe(
      filter(user => user !== null && user.id !== undefined),
      take(1)
    ).subscribe(async (user) => {
      console.log("useruseruseruser", user)
      if (!user || !user.id) {
        console.error('User not found or user ID is missing');
        this.messageService.showToast("Utilisateur non trouvé", Message.danger);
        this.router.navigate(['/login']);
        return;
      }

      try {
        this.userInterventions = await this.interventionService.getInterventionsByUser(user.id);
        const now = new Date();
        
        // Filtre les interventions passées
        this.pastInterventions = this.userInterventions.filter(intervention => 
          new Date(intervention.appointment_end) < now || 
          intervention.status === 'completed' || 
          intervention.status === 'canceled'
        );
        
        // Filtre les interventions à venir
        this.upcomingInterventions = this.userInterventions.filter(intervention => {
          const isUpcom = new Date(intervention.appointment_end) >= now;
          const isPast = this.pastInterventions.some(item => item.id === intervention.id);
          return isUpcom && !isPast
        });
      } catch (error) {
        console.error('Error loading interventions:', error);
        this.messageService.showToast("Erreur lors du chargement des interventions", Message.danger);
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  confirmCancel(intervention: Intervention) {
    this.cancelIntervention(intervention);
  }

  /**
   * Annule une intervention et met à jour les listes
   * @param {Intervention} intervention - L'intervention à annuler
   */
  cancelIntervention(intervention: Intervention) {
    console.log('Intervention annulée:', intervention);
    const obs$ = this.interventionService.manageEndIntervention(intervention.id, true, null);
    this.loadingService.showLoaderUntilCompleted(obs$).subscribe({
        next: (response: any) => {
          this.messageService.showToast(response.message, Message.success);
          this.pastInterventions.push(intervention)
          this.upcomingInterventions = this.upcomingInterventions.filter((uI) => uI.id !== intervention.id);
        },
        error: (err: any) => {
          this.messageService.showToast(err, Message.danger);
        }
    });
  }

  /**
   * Ouvre une modal pour afficher les photos en plein écran
   * @param {string[]} photos - Liste des URLs des photos
   * @param {number} index - Index de la photo à afficher en premier
   */
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