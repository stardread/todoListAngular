import { type Todo as TodoModel } from './../../models/todo';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-todo',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './todo.html',
  styleUrl: './todo.scss'
})
export class Todo {
  todo = input<TodoModel>();

  getStatusIcon(): string {
    switch (this.todo()?.status) {
      case 'todo':
        return 'pending_actions';
      case 'done':
        return 'check_box';
      case 'inProgress':
        return 'hourglass_empty';
      default:
        return '';
    }
  }
}
