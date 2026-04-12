import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Employees } from './pages/employees/employees';
import { AddEmployee } from './pages/add-employee/add-employee';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'employees', component: Employees },
  { path: 'add-employee', component: AddEmployee },
];
