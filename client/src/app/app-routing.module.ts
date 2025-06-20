import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PublicGoalsComponent } from './public-goals/public-goals.component';
import { PublicGoalDetailsComponent } from './public-goal-details/public-goal-details.component';


const routes: Routes = [
  { path: '', redirectTo: '/public', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'public', component: PublicGoalsComponent },
  { path: 'public/:publicId', component: PublicGoalDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
