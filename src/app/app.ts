import { Component, signal } from '@angular/core';
import { NavigationComponent } from "./navigation/navigation.component";

@Component({
  selector: 'app-root',
  imports: [NavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Inventory Manager');
}
