import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Employees } from './pages/employees/employees';
import { AddEmployee } from './pages/add-employee/add-employee';
import { UpdateEmployee } from './pages/update-employee/update-employee';
import { ViewEmployee } from './pages/view-employee/view-employee';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'employees', component: Employees },
  { path: 'add-employee', component: AddEmployee },
  { path: 'update-employee/:id', component: UpdateEmployee },
  { path: 'view-employee/:id', component: ViewEmployee },
];
