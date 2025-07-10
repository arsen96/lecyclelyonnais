import { Component, ElementRef, inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, MessageService } from 'src/app/services/message.service';
import { TechnicianService } from 'src/app/services/technician.service';
import { ZoneService } from 'src/app/services/zone.service';

@Component({
  selector: 'app-technician',
  templateUrl: './technician.page.html',
  styleUrls: ['./technician.page.scss'],
})
export class TechnicianPage implements OnInit {
  technicianForm: FormGroup;
  displayMsg = false;
  showPassword = false;
  messageService = inject(MessageService);
  addressValidated = false;
  technicianSelected = null;
  actRoute = inject(ActivatedRoute);
  technicianId: number = null;
  constructor(
    private fb: FormBuilder,
    public zoneService: ZoneService,
    public technicianService: TechnicianService
  ) {
    this.technicianId = Number(this.actRoute.snapshot.params['id']) ? Number(this.actRoute.snapshot.params['id']) : null;
  }

  ionViewWillEnter(): void {
    this.displayMsg = false;
  }

  /**
   * Initialise le formulaire et charge les données en mode édition
   * @returns {Promise<void>}
   */
  async manageForm(): Promise<void> {
    await this.technicianService.get();
    this.technicianForm = this.fb.group({
      last_name: ['Kubtyan', [Validators.required, Validators.minLength(2)]],
      first_name: ['Kubtyan', [Validators.required, Validators.minLength(2)]],
      email: ['kubatarsen@gmail.com', [Validators.required, Validators.email]],
      password: ['', [
        control => {
          if (!this.technicianSelected && (!control.value || control.value.length < 8)) {
            return { required: true, minlength: true };
          }
          if (control.value && control.value.length > 0 && control.value.length < 8) {
            return { minlength: true };
          }
          return null;
        }
      ]],
      phone: ['06 06 06 06 06', [Validators.required]],
      address: ['', []],
    });

    if (this.technicianId) {
      this.technicianSelected = this.technicianService.technicians.find(technician => technician.id === this.technicianId);
      if (this.technicianSelected) {
        const { password, ...technicianData } = this.technicianSelected;
        this.technicianForm.patchValue(technicianData);
        this.addressValidated = true;
      }
    }
  }

  /**
   * Génère un mot de passe aléatoire de 8 caractères et l'affiche
   * @returns {void}
   */
  generatePassword(): void {
    const newPassword = Math.random().toString(36).slice(-8);
    this.technicianForm.patchValue({ password: newPassword });
    this.showPassword = true;
  }

  /**
   * Soumet le formulaire pour créer ou modifier un technicien
   * Valide l'adresse et gère les réponses succès/erreur
   * @returns {Promise<void>}
   */
  async onSubmit(): Promise<void> {
    if (this.technicianForm.valid) {
      if (!this.addressValidated && this.technicianForm.value.address.length > 0) {
        this.messageService.showMessage('Veuillez sélectionner une adresse valide dans la liste des suggestions.', Message.danger);
      } else {
        const postFormData = (message: string) => {
          if (message) {
            this.messageService.showMessage(message, Message.success);
          }
          this.displayMsg = true;
          this.technicianService.technicians = new Array();
          this.zoneService.allZones = new Array();
          if (!this.technicianSelected) {
            this.technicianForm.disable();
            setTimeout(() => {
              this.resetForm();
            }, 2000);
          }
        };

        if (this.technicianSelected) {
          // Mode édition
          this.technicianService.update({ id: this.technicianId, ...this.technicianForm.value }).then((res) => {
            postFormData(res?.message);
          }, (err) => {
            console.log("errerrerr", err);
            this.messageService.showMessage(err, Message.danger);
            this.displayMsg = true;
          });
        } else {
          // Mode création
          this.technicianService.create(this.technicianForm.value).then((res) => {
            postFormData(res?.message);
          }, (err) => {
            this.messageService.showMessage(err, Message.danger);
            this.displayMsg = true;
          });
        }
      }
    }
  }

  /**
   * Valide et met à jour l'adresse depuis Google Places
   * @param {any} place - Objet place de Google Places API
   * @returns {void}
   */
  handleAddressChange(place: any): void {
    if (place.geometry) {
      console.log(place);
      this.technicianForm.patchValue({ address: place.formatted_address });
      this.addressValidated = true;
    }
  }

  /**
   * Méthode du cycle de vie - initialise le formulaire
   */
  ngOnInit(): void {
    this.manageForm();
  }

  /**
   * Méthode du cycle de vie - efface les messages avant de quitter
   */
  ionViewWillLeave(): void {
    this.messageService.clearMessage();
  }

  /**
   * Remet le formulaire à zéro et réactive les champs
   */
  resetForm(): void {
    this.messageService.clearMessage();
    this.technicianForm.reset();
    this.technicianForm.enable();
    this.addressValidated = false;
  }
}