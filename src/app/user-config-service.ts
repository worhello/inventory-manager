import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Event, NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserConfigService {
  private readonly router = inject(Router);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        localStorage.setItem('lastUsedRoute', event.url);
      }
    });
  }

  public getLastUsedRoute() {
    const routeFromStorage = localStorage.getItem('lastUsedRoute');
    return routeFromStorage ?? '/inventory';
  }
}
