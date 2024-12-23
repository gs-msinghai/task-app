// src/app/task/task.model.ts
export interface Task {
    id: number;
    name: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Completed';
}
export enum Mode {
    VIEW = "VIEW",
    EDIT = "EDIT",
    NEW = "NEW"
}