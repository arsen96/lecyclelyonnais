import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { BehaviorSubject, filter, map } from "rxjs"


export enum Message {
  success = 'success',
  danger =  'danger',
  warning = 'warning',
  info = 'info'
}
export class MessageStatus {
  static status: Message.success | Message.danger;
}
@Injectable({
  providedIn:'root'
})
export class MessageService {
  constructor(private toastController: ToastController) {}
  private messageEmitter = new BehaviorSubject<any>({message:[],status:''})
  message$ = this.messageEmitter.asObservable()
  // .pipe(
  //   filter((value) => {
  //     return value && value.message?.length > 0
  //   })
  // )

  /**
   * Affiche un message avec un statut spécifique
   * @param message - Message(s) à afficher (string ou tableau de strings)
   * @param status - Statut du message (success, danger, warning, info)
   */
  showMessage(message:string | string[],status:MessageStatus){
    let messageSave = Array.isArray(message) ? message : [message]
    this.messageEmitter.next({message:messageSave,status});
  }

  /**
   * Efface tous les messages affichés
   */
  clearMessage(){
    this.messageEmitter.next({message:[],status:''});
  }


  /**
   * Affiche un toast avec les paramètres spécifiés
   * @param message - Texte du message
   * @param color - Couleur du toast (success, danger, warning, info)
   * @param position - Position du toast (top, bottom, middle)
   * @param duration - Durée d'affichage en millisecondes
   */
  async showToast(message: string, color: 'success' | 'danger' | 'warning' | 'info', position: 'top' | 'bottom' | 'middle' = 'bottom',duration:number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position
    });
    toast.present();
  }

}
