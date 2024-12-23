import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskCreateComponent } from './components/task-create/task-create.component';
import { CanDeactivateGuard } from './candeactivate.guard';

const routes: Routes = [
  { path: '', component: TaskListComponent },
  {
    path: 'new', component: TaskCreateComponent,
    canDeactivate: [CanDeactivateGuard],
   },
  {
    path: ':id', component: TaskCreateComponent,
    canDeactivate: [CanDeactivateGuard],
   }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
