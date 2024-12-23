// src/app/task/task.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private storageKey = 'tasks'; // Key to store tasks in localStorage

  private tasksSubject = new BehaviorSubject<Task[]>(this.loadTasks());

  constructor() {}

  // Load tasks from localStorage or return default data if none found
  private loadTasks(): Task[] {
    const storedTasks = localStorage.getItem(this.storageKey);
    if (storedTasks) {
      return JSON.parse(storedTasks);
    } else {
      // Default tasks if localStorage is empty
      const defaultTasks: Task[] = [
        { id: 1, name: 'Task 1', description: 'This is task 1', status: 'Pending' },
        { id: 2, name: 'Task 2', description: 'This is task 2', status: 'In Progress' },
        { id: 3, name: 'Task 3', description: 'This is task 3', status: 'Completed' }
      ];
      this.saveTasks(defaultTasks); // Save default tasks to localStorage
      return defaultTasks;
    }
  }

  // Save tasks to localStorage
  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  // Get tasks as an observable
  getTasks() {
    return this.tasksSubject.asObservable();
  }

  // Get task by ID
  getTaskById(id: number): Task | null {
    return this.tasksSubject.value.find(task => task.id === id) || null;
  }

  // Add a new task
  addTask(task: Task): void {
    task.id = this.tasksSubject.value.length ? Math.max(...this.tasksSubject.value.map(t => t.id)) + 1 : 1;
    const updatedTasks = [task, ...this.tasksSubject.value];
    this.tasksSubject.next(updatedTasks);
    this.saveTasks(updatedTasks); // Persist tasks to localStorage
  }

  // Update an existing task
  updateTask(updatedTask: Task): void {
    const tasks = this.tasksSubject.value;
    const index = tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      this.tasksSubject.next([...tasks]);
      this.saveTasks(tasks); // Persist tasks to localStorage
    }
  }

  // Delete a task by ID
  deleteTask(id: number): void {
    const updatedTasks = this.tasksSubject.value.filter(task => task.id !== id);
    this.tasksSubject.next(updatedTasks);
    this.saveTasks(updatedTasks); // Persist tasks to localStorage
  }

  // Delete multiple tasks by IDs
  deleteTasks(ids: number[]): void {
    const updatedTasks = this.tasksSubject.value.filter(task => !ids.includes(task.id));
    this.tasksSubject.next(updatedTasks);
    this.saveTasks(updatedTasks); // Persist tasks to localStorage
  }
}
