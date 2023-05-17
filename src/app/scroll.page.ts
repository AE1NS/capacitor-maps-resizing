import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-map-scroll',
  template: `<ion-content>
    <capacitor-google-map #map></capacitor-google-map>
    <div class="content">
      <ion-button expand="block" (click)="back()">Back</ion-button>
      <p *ngFor="let i of loremIpsumIterations">Lorem Ipsum</p>
    </div>
  </ion-content>`,
  styles: [
    `
      ion-content {
        --background: transparent;

        capacitor-google-map {
          display: block;
          width: 100%;
          height: 200px;
        }

        .content {
          background: white;
        }
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ScrollPage implements OnDestroy {
  @ViewChild('map') mapContainer: ElementRef | undefined;
  loremIpsumIterations = Array(30)
    .fill(0)
    .map((x, i) => i);

  private _map!: GoogleMap;

  constructor(private _navController: NavController) {}

  async ionViewDidEnter() {
    this._map = await GoogleMap.create({
      id: 'my-map',
      apiKey: 'API_KEY',
      element: this.mapContainer?.nativeElement,
      config: {
        center: {
          lat: 33.6,
          lng: -117.9,
        },
        zoom: 10,
      },
    });
  }

  async ngOnDestroy() {
    await this._map.destroy();
  }

  back() {
    this._navController.back();
  }
}
