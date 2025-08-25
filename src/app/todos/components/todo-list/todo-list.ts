import { Component, inject, input } from '@angular/core';
import { Todo as TodoModel } from '../../models/todo';
import { Todo } from '../todo/todo';
import { DataAccess } from '../../services/data-access';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-todo-list',
  imports: [Todo, MatProgressSpinnerModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss'
})
export class TodoList {

  todos = input<TodoModel[]>();
  todosService = inject(DataAccess);
}
