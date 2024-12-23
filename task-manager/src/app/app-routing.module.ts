import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Lazy load the TaskModule
const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { 
    path: 'tasks', 
    loadChildren: () => import('./task/task.module').then(m => m.TaskModule) 
  },
  { path: '**', redirectTo: '/tasks' } // Wildcard route for 404
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
