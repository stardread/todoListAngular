import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { TodoForm } from '../todo-form/todo-form';
import {MatButtonModule} from '@angular/material/button';
import { Todo } from '../../models/todo';
@Component({
  selector: 'app-todo-form-dialog',
  imports: [MatDialogContent, TodoForm, MatButtonModule],
  templateUrl: './todo-form-dialog.html',
  styleUrl: './todo-form-dialog.scss',
})
export class TodoFormDialog {
  data = inject<{todo: Todo}>(MAT_DIALOG_DATA);

  todo: Todo | null = this.data?.todo || null;
}
