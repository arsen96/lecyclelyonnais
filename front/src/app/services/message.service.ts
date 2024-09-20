import { Injectable } from "@angular/core";
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
  private messageEmitter = new BehaviorSubject<any>({message:[],status:''})
  message$ = this.messageEmitter.asObservable().pipe(
    filter((value) => {
      return value && value.message?.length > 0
    })
  )

  showMessage(message:string | string[],status:MessageStatus){
    let messageSave = Array.isArray(message) ? message : [message]
    this.messageEmitter.next({message:messageSave,status});
  }

  hideMessage(){
    this.messageEmitter.next(false);
  }

}
