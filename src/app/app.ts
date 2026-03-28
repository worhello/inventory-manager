import { Component, signal } from '@angular/core';
import { NavigationComponent } from './navigation/navigation.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-root',
  imports: [MatDividerModule, NavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Inventory Manager');
}
