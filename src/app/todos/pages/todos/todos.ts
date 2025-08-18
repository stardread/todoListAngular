import { Component, inject } from '@angular/core';
import { DataAccess } from '../../services/data-access';
import { MatButton } from '@angular/material/button';
import { Todo } from '../../components/todo/todo';

@Component({
  selector: 'app-todos',
  imports: [MatButton, Todo],
  templateUrl: './todos.html',
  styleUrl: './todos.scss',
})
export class Todos {
  todosService = inject(DataAccess);

  ngOnInit(): void {
    this.refreshTodos();
  }

  async refreshTodos(): Promise<void> {

    try {
      await this.todosService.getTodos();
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }
}
