import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({})),
    provideRouter([
      {
        path: 'home',
        loadComponent: () => import('./app/home.page').then((m) => m.HomePage),
      },
      {
        path: 'scroll',
        loadComponent: () =>
          import('./app/scroll.page').then((m) => m.ScrollPage),
      },
      {
        path: 'sheet',
        loadComponent: () =>
          import('./app/sheet.page').then((m) => m.SheetPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ]),
  ],
});
