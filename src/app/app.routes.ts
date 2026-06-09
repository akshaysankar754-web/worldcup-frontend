import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard';
import { ResultsComponent } from './pages/results/results';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [AuthGuard], data: { roles: ['User'] } },
  { path: 'results', component: ResultsComponent, canActivate: [AuthGuard], data: { roles: ['User', 'Admin'] } },
  { path: '**', redirectTo: 'login' }
];
