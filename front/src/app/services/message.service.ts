import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { BehaviorSubject, filter, map } from "rxjs"


export enum Message {
  success = 'success',
  danger =  'danger'
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

  showMessage(message:string | string[],status:MessageStatus){
    let messageSave = Array.isArray(message) ? message : [message]
    this.messageEmitter.next({message:messageSave,status});
  }

  clearMessage(){
    this.messageEmitter.next({message:[],status:''});
  }


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
