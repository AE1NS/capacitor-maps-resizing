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
import { CupertinoPane } from 'cupertino-pane';
import { Capacitor } from '@capacitor/core';
import { Subject, interval, takeUntil } from 'rxjs';

@Component({
  selector: 'app-map-resize',
  template: `<capacitor-google-map #map></capacitor-google-map>
    <div #sheet>
      <ion-button expand="block" (click)="back()">Back</ion-button>
    </div>`,
  styles: [
    `
      capacitor-google-map {
        display: block;
        width: 100%;
        height: 99.9%;

        &.dragging {
          transition: none !important;
        }
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SheetPage implements OnDestroy {
  @ViewChild('map') mapContainer: ElementRef | undefined;
  @ViewChild('sheet') sheetContainer: ElementRef | undefined;

  private _map!: GoogleMap;
  private _sheet!: CupertinoPane;

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

    let transitioning$ = new Subject<void>();
    let dragStart: number = 0;
    this._sheet = new CupertinoPane(this.sheetContainer?.nativeElement, {
      buttonDestroy: false,
      events: {
        onDragStart: () => {
          this.mapContainer?.nativeElement.classList.add('dragging');

          dragStart = this._sheet.getPanelTransformY();
        },
        onDragEnd: () => {
          this.mapContainer?.nativeElement.classList.remove('dragging');

          if (
            dragStart === this._sheet.getPanelTransformY() &&
            this._sheet.settings.events?.onTransitionEnd
          ) {
            this._sheet.settings.events.onTransitionEnd({});
          }
        },
        onTransitionStart: (e: any) => {
          if (
            e.type === 'end' &&
            e.translateY.new === this._sheet.getPanelTransformY() &&
            this._sheet.settings.events?.onTransitionEnd
          ) {
            this._sheet.settings.events.onTransitionEnd({});
          } else {
            this._setMapHeight(e.translateY.new);
            transitioning$ = new Subject();

            if (Capacitor.isNativePlatform()) {
              interval(1)
                .pipe(takeUntil(transitioning$))
                .subscribe(() => {
                  this._map.handleScrollEvent();
                });
            }
          }
        },
        onMoveTransitionStart: (e: any) => {
          this._setMapHeight(e.translateY);
        },
        onTransitionEnd: () => {
          transitioning$.next();
          transitioning$.complete();

          if (Capacitor.isNativePlatform()) {
            this._map.handleScrollEvent();
          }
        },
      } as any,
    });

    if (this.mapContainer) {
      this.mapContainer.nativeElement.style.transition = `height ${this._sheet.settings.animationDuration}ms ${this._sheet.settings.animationType} 0s`;
    }

    await this._sheet.present({ animate: true });
  }

  async ngOnDestroy() {
    await this._map.destroy();
  }

  back() {
    this._navController.back();
  }

  private _setMapHeight(topToSheetDistance: number) {
    if (this.mapContainer) {
      this.mapContainer.nativeElement.style.height =
        topToSheetDistance + 12 + 'px';
      if (Capacitor.isNativePlatform()) {
        this._map.handleScrollEvent();
      }
    }
  }
}
