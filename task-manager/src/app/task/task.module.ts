// src/app/task/task.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskRoutingModule } from './task-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [
    TaskListComponent,
    TaskCreateComponent
  ],
  imports: [
    CommonModule,
    TaskRoutingModule,
    ReactiveFormsModule, // Add ReactiveFormsModule for form handling
    FormsModule, // Add FormsModule for ngModel support
    MaterialModule
    
  ]
})
export class TaskModule {}
