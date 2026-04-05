import { Routes } from '@angular/router';
import { CookingView } from './cooking-view/cooking-view';
import { InventoryView } from './inventory-view/inventory-view';
import { ShoppingView } from './shopping-view/shopping-view';
import { Settings } from './settings/settings';
import { About } from './about/about';

export const routes: Routes = [
  { path: '', redirectTo: '/inventory', pathMatch: 'full' },
  { path: 'inventory', component: InventoryView, data: {title: 'Inventory'} },
  { path: 'shopping', component: ShoppingView, data: {title: 'Shopping'} },
  { path: 'cooking', component: CookingView, data: {title: 'Cooking'} },
  { path: 'settings', component: Settings, data: {title: 'Settings'} },
  { path: 'about', component: About, data: {title: 'About'} },
];
