import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
})
export class ImageModalComponent implements OnInit {
  @Input() photos: string[];
  @Input() index: number;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    console.log('Current image path:', this.photos[this.index]);
  }

  close() {
    this.modalController.dismiss();
  }

  next() {
    this.index = (this.index + 1) % this.photos.length;
  }

  previous() {
    this.index = (this.index - 1 + this.photos.length) % this.photos.length;
  }
}