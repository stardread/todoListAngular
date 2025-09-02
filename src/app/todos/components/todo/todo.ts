import { type Todo as TodoModel } from './../../models/todo';
import { Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { Status } from '../../enums/status';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TodoFormDialog } from '../todo-form-dialog/todo-form-dialog';

@Component({
  selector: 'app-todo',
  imports: [MatCardModule, MatButtonModule, MatIconModule, NgClass],
  templateUrl: './todo.html',
  styleUrl: './todo.scss',
})
export class Todo {
  todo = input<TodoModel>();

  dialog = inject(MatDialog);

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.data = {
      todo: this.todo(),
    };
    this.dialog.open(TodoFormDialog, dialogConfig);
  }

  getStatusIcon(): string {
    switch (this.todo()?.status) {
      case Status[0]:
        return 'pending_actions';
      case Status[1]:
        return 'hourglass_empty';
      case Status[2]:
        return 'check_box';
      default:
        return '';
    }
  }
}
