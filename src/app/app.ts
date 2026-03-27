import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserConfigService } from './user-config-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('inventory-manager');
  private router = inject(Router);
  private userConfigService = inject(UserConfigService);

  constructor() {
    this.router.navigate([this.userConfigService.getLastUsedRoute()]);
  }
}
