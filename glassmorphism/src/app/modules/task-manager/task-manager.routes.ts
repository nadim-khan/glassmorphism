import { Routes } from '@angular/router';
import { TaskViewComponent } from './task-view/task-view.component';

export const TaskRoutes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: TaskViewComponent },
  { path: 'lists/:listId', component: TaskViewComponent },
];