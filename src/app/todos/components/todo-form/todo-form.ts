import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Todo } from '../../models/todo';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Status } from '../../enums/status';
import { MatButtonModule } from '@angular/material/button';
import { TodoFormDialog } from '../todo-form-dialog/todo-form-dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { DataAccess } from '../../services/data-access';
@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
})
export class TodoForm {
  private todoService = inject(DataAccess);
  readonly dialogRef = inject(MatDialogRef<TodoFormDialog>);

  errorMessage = signal<string>('');
  todo = input<Todo | null>();

  isEditMode = computed(() => !!this.todo()?._id);

  statuses = [
    { value: Status[0], viewValue: 'To Do' },
    { value: Status[1], viewValue: 'In Progress' },
    { value: Status[2], viewValue: 'Done' },
  ];

  todoForm = computed(
    () =>
      new FormGroup({
        title: new FormControl(this.todo()?.title || '', Validators.required),
        description: new FormControl(
          this.todo()?.description || '',
          Validators.required
        ),
        status: new FormControl(
          this.todo()?.status || Status[0],
          Validators.required
        ),
      })
  );

  async handleUpdateTodo() {
    const isUpdated = await this.todoService.updateTodo({
      ...this.todoForm().value,
      _id: this.todo()?._id,
    } as Todo);
    if (isUpdated) {
      await this.todoService.getTodosByStatus(
        this.todo()?.status || this.todoForm().value.status || Status[0]
      );
      this.dialogRef.close();
    } else {
      this.errorMessage.set(
        'An error occurred while updating the task. Please try again.'
      );
    }
  }

  async handleCreateTodo() {
    const isCreated = await this.todoService.createTodo({
      ...this.todoForm().value,
    } as Todo);
    if (isCreated) {
      await this.todoService.getTodosByStatus(
        this.todoForm().value.status || Status[0]
      );
      this.dialogRef.close();
    } else {
      this.errorMessage.set(
        'An error occurred while creating the task. Please try again.'
      );
    }
  }

  async onSubmit() {
    if (this.todoForm().valid) {
      if (this.isEditMode()) {
        this.handleUpdateTodo();
      }
      else {
        this.handleCreateTodo();
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
