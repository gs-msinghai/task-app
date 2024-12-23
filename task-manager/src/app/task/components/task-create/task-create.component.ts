// src/app/task/task-create/task-create.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Mode, Task } from '../../model/task.model';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss']
})

export class TaskCreateComponent implements OnInit {
  taskForm: FormGroup;
  isEditing: boolean = false;
  task: Task = { id: 0, name: '', description: '', status: 'Pending' };
  mode: Mode = Mode.NEW;
  modes = Mode;
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize the task form with validation rules
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      status: ['Pending', Validators.required]
    });
  }

  ngOnInit(): void {

    const taskId = this.route.snapshot.paramMap.get('id');
    this.setFormMode(this.route.snapshot.queryParamMap.get('mode') || 'new')
    if (taskId) {
      this.isEditing = true;
      const task = this.taskService.getTaskById(+taskId);
      if (task) {
        this.task = { ...task };
        this.taskForm.patchValue(this.task); // Populate form with existing task data
      }
    }
  }

  setFormMode(option: string): void { 
    
    switch (option) { 
      case 'view':
        this.mode = Mode.VIEW;
        this.taskForm.disable();
        break;
      case 'edit':
        this.mode = Mode.EDIT;
        break;
      case 'new':
        this.mode = Mode.NEW;
        break;
      default:
        this.mode = Mode.NEW;
    }
  }
  // Getter for easy access to form controls
  get formControls() {
    return this.taskForm.controls;
  }

  onSubmit(): void {
    if (this.mode === Mode.VIEW) {
      
      this.mode = Mode.EDIT;
      this.taskForm.enable();
      return 
    }
    if (this.taskForm.invalid) {
      return; // Don't proceed if the form is invalid
    }

    // Update or create task
    const formData: Task = this.taskForm.value;
    if (this.isEditing) {
      this.taskService.updateTask({ ...this.task, ...formData });
    } else {
      this.taskService.addTask(formData);
    }

    // Redirect to task list after successful submission
    this.router.navigate(['/tasks']);
  }
}