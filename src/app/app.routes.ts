import { Routes } from '@angular/router';
import { Todos } from './todos/pages/todos/todos';
export const routes: Routes = [
  { path: 'todos', component: Todos },
  { path: '', redirectTo: '/todos', pathMatch: 'full' },
];
