import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  template: `<ion-header>
      <ion-toolbar>
        <ion-title>Google Map examples</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button expand="block" routerLink="/scroll">
        Scrollable page
      </ion-button>
      <ion-button expand="block" routerLink="/sheet">
        Draggable sheet
      </ion-button>
    </ion-content>`,
  styles: [
    `
      ion-content {
        --padding-top: 16px;
        --padding-start: 16px;
        --padding-end: 16px;
      }
    `,
  ],
  standalone: true,
  imports: [IonicModule, RouterModule],
})
export class HomePage {}
