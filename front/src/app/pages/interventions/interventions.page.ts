import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Intervention } from 'src/app/models/intervention';
import { GlobalService } from 'src/app/services/global.service';
import { InterventionService } from 'src/app/services/intervention.service';
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
  userInterventions: Intervention[] = [];
  pastInterventions: Intervention[] = [];
  upcomingInterventions: Intervention[] = [];

  constructor() { }

  async ngOnInit() {
    const success = await lastValueFrom(this.interventionService.interventionsLoaded);
    console.log("success", success)
    if (!success) {
      this.messageService.showToast("Une erreur est survenue lors du chargement des interventions", Message.danger);
      this.router.navigate(['/login']);
    }
    const user = this.globalService.user.getValue();
    console.log("user", user.id)
    this.userInterventions = await this.interventionService.getInterventionsByUser(user.id);
    
    const now = new Date();
    this.pastInterventions = this.userInterventions.filter(intervention => new Date(intervention.appointment_end) < now);
    this.upcomingInterventions = this.userInterventions.filter(intervention => new Date(intervention.appointment_end) >= now);

    console.log("Past Interventions", this.pastInterventions);
    console.log("Upcoming Interventions", this.upcomingInterventions);
  }
}
