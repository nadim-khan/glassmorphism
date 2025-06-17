import { Routes } from '@angular/router';
import { QuranComponent } from './components/quran/quran.component';
import { authGuard } from './services/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { ProductsComponent } from './components/products/products.component';
import { ChatComponent } from './components/chat/chat.component';

export const routes: Routes = [
  {
    path: 'quran',
    component: QuranComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard]
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'taskManager',
    loadChildren: () => import('./modules/task-manager/task-manager.routes').then((m) => m.TaskRoutes)
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    component: QuranComponent,
    canActivate: [authGuard]
  },

];
