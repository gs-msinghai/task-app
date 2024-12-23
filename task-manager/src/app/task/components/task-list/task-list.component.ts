// src/app/task/task-list/task-list.component.ts
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../model/task.model';
import { Router } from '@angular/router';
import { filter, Observable, pipe, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../common/dialog/confirm-dialog-component/confirm-dialog-component.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];  // All tasks
  filteredTasks: Task[] = [];  // Filtered tasks based on user input
  selectedTasks: Set<number> = new Set();
  private unbinder: EventEmitter<string> = new EventEmitter();
  // To track selected tasks for deletion
  searchText: string = '';  // To bind with search input field
  selectedStatus: string = '';  // To filter by task status

  constructor(private taskService: TaskService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Fetch tasks from the service
    this.taskService.getTasks().pipe(takeUntil(this.unbinder.pipe(filter(v => v === 'DESTROY')))).subscribe(tasks => { 
      this.tasks = tasks;
      this.filteredTasks = [...this.tasks]; // Initialize filteredTasks
    });
    // Initialize filteredTasks
  }

  // Toggle task selection for deletion (checkbox logic)
  toggleSelection(taskId: number): void {
    if (this.selectedTasks.has(taskId)) {
      this.selectedTasks.delete(taskId); // Deselect task
    } else {
      this.selectedTasks.add(taskId); // Select task
    }
  }

  // Delete selected tasks
  deleteSelectedTasks(): void {
    if (this.selectedTasks.size > 0) {
      this.openConfirmDialog('Are you sure you want to delete the selected tasks?')
        .subscribe(result => {
          if (result) {
            // Convert Set to Array and delete tasks from service
            this.taskService.deleteTasks(Array.from(this.selectedTasks));
            this.selectedTasks.clear();  // Clear selected tasks after deletion
            this.applyFilters();  // Reapply filters to update the task list
          }
        });
    }
  }

  // Delete a single task
  deleteTask(taskId: number): void {
    this.openConfirmDialog('Are you sure you want to delete this task?')
      .subscribe(result => {
        if (result) {
          this.selectedTasks.clear();
          this.taskService.deleteTask(taskId);
          this.applyFilters();
        }
      });
  }


  // General method to open the confirmation dialog
  openConfirmDialog(message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message }
    });
    return dialogRef.afterClosed(); // Return the result as Observable<boolean>
  }

  
  // Filter tasks based on search text and selected status
  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
                            task.description.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesStatus = this.selectedStatus ? task.status === this.selectedStatus : true;
      return matchesSearch && matchesStatus;
    });
  }

  // Get status class for applying colorful status labels
  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-in-progress';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  }

  // Navigate to task detail (View)
  viewTask(taskId: number): void {
    this.router.navigate([`/tasks/${taskId}`],{ queryParams: { mode: 'view' } });
  }

  // Navigate to edit task form
  editTask(taskId: number): void {
    this.router.navigate([`/tasks/${taskId}`],{ queryParams: { mode: 'edit' } });
  }

  ngOnDestroy(): void { 
    this.unbinder.emit('DESTROY');
  }
}
