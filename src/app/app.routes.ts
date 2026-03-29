import { Routes } from '@angular/router';
import { CookingView } from './cooking-view/cooking-view';
import { InventoryView } from './inventory-view/inventory-view';
import { ShoppingView } from './shopping-view/shopping-view';
import { Settings } from './settings/settings';

export const routes: Routes = [
  { path: '', redirectTo: '/inventory', pathMatch: 'full' },
  { path: 'inventory', component: InventoryView },
  { path: 'shopping', component: ShoppingView },
  { path: 'cooking', component: CookingView },
  { path: 'settings', component: Settings },
];
