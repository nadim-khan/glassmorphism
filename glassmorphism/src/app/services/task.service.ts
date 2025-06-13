import { Injectable } from '@angular/core';
import { MakeRequestService } from './make-request.service';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private makeRequest: MakeRequestService) { }


  getLists() {
    return this.makeRequest.get('lists');
  }

  createList(title: string) {
    // We want to send a web request to create a list
    return this.makeRequest.post('lists', { title });
  }

  updateList(id: string, title: string) {
    // We want to send a web request to update a list
    return this.makeRequest.patch(`lists/${id}`, { title });
  }

  updateTask(listId: string, taskId: string, title: string) {
    // We want to send a web request to update a list
    return this.makeRequest.patch(`lists/${listId}/tasks/${taskId}`, { title });
  }

  deleteTask(listId: string, taskId: string) {
    return this.makeRequest.delete(`lists/${listId}/tasks/${taskId}`);
  }

  deleteList(id: string) {
    return this.makeRequest.delete(`lists/${id}`);
  }

  getTasks(listId: string) {
    return this.makeRequest.get(`lists/${listId}/tasks`);
  }

  createTask(title: string, listId: string) {
    // We want to send a web request to create a task
    return this.makeRequest.post(`lists/${listId}/tasks`, { title });
  }

  complete(task: Task) {
    return this.makeRequest.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }
}