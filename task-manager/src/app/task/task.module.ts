// src/app/task/task.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskCreateComponent } from './components/task-create/task-create.component';
import { TaskRoutingModule } from './task-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { MaterialModule } from '../common/material.module'; // Import MaterialModule
import { CanDeactivateGuard } from './candeactivate.guard';
import { ConfirmDialogComponent } from '../common/dialog/confirm-dialog-component/confirm-dialog-component.component';

@NgModule({
  declarations: [
    TaskListComponent,
    TaskCreateComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    TaskRoutingModule,
    ReactiveFormsModule, // Add ReactiveFormsModule for form handling
    FormsModule, // Add FormsModule for ngModel support
    MaterialModule
  ],
  providers: [CanDeactivateGuard],

})
export class TaskModule {}
