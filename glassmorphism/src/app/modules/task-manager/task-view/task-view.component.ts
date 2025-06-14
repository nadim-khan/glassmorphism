import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { List } from '../../../models/list.model';
import { Task } from '../../../models/task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  lists: List[] = [];
  tasks: Task[] = [];
  listTitle = '';
  taskTitle = '';
  activeListId: string = '';

  selectedListId: string = '';

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router, private toasterService: ToasterService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: any) => {
        if (params.listId) {
          this.selectedListId = params.listId;
          this.taskService.getTasks(params.listId).subscribe((tasks: any) => {
            this.tasks = tasks;
          })
        } else {
          this.tasks = [];
        }
      }
    )

    this.getAllList();

  }

  getAllList() {
    this.taskService.getLists().subscribe((lists: any) => {
      this.lists = lists;
    }, (err: any) => {
      this.toasterService.error('Error in fetching List')
    })
  }

  createList() {
    this.taskService.createList(this.listTitle).subscribe((list: any) => {
      this.toasterService.success(`${this.listTitle} added successfully`);
      this.listTitle = '';
      this.getAllList();
    }, (err: any) => {
      this.toasterService.error('Error in creating list with this title')
    });
  }

  createTask(listId: string) {
    this.taskService.createTask(this.taskTitle, listId).subscribe((newTask: any) => {
      this.toasterService.success(`${this.taskTitle} added successfully`);
      this.getTask();
    }, (err: any) => {
      this.toasterService.error('Error in creating task with this title')
    });
  }

  getTask() {
    if (this.activeListId && this.activeListId.trim() !== '')
      this.taskService.getTasks(this.activeListId).subscribe((tasks: any) => {
        this.tasks = tasks;
      }, (err: any) => {
        this.toasterService.error('Error in fetching List')
      })
  }

  onTaskClick(task: Task) {
    // we want to set the task to completed
    this.taskService.complete(task).subscribe(() => {
      // the task has been set to completed successfully
      console.log("Completed successully!");
      task.completed = !task.completed;
    })
  }

  onDeleteListClick(listId: string) {
    this.taskService.deleteList(listId).subscribe((res: any) => {
      this.toasterService.success(`List Item ${res.title} deleted successfully`);
      this.getAllList();
    })
  }

  onDeleteTaskClick(id: string) {
    this.taskService.deleteTask(this.selectedListId, id).subscribe((res: any) => {
      this.tasks = this.tasks.filter(val => val._id !== id);
      console.log(res);
    })
  }

  navigateTo(link: string, id?: any) {
    if (id) {
      this.router.navigate(['taskManager/' + link, id])
    } else {
      this.router.navigate(['taskManager/' + link])
    }

  }

}
