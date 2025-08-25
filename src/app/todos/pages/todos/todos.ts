import { Component, inject } from '@angular/core';
import { DataAccess } from '../../services/data-access';
import { MatTabsModule } from '@angular/material/tabs';
import { TodoList } from '../../components/todo-list/todo-list';
import { Status } from '../../enums/status';

@Component({
  selector: 'app-todos',
  imports: [MatTabsModule, TodoList],
  templateUrl: './todos.html',
  styleUrl: './todos.scss',
})
export class Todos {
  todosService = inject(DataAccess);


  ngOnInit(): void {
    this.refreshTodos(Status[0]);
  }

  async refreshTodos(status: string): Promise<void> {
    try {
      await this.todosService.getTodosByStatus(status);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  onTabChange($event: any): void {
    this.refreshTodos(Status[$event.index]);
  }
}
