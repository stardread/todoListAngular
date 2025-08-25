import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Todo } from '../models/todo';
import { firstValueFrom } from 'rxjs';
import { TodoList } from '../models/todo-list';

@Injectable({
  providedIn: 'root',
})
export class DataAccess {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/tasks'; // TODO use .env file

  readonly todos = signal<TodoList>({ todo: [], inProgress: [], done: [] });
  readonly todosLoading = signal(false);

  async getTodosByStatus(status: string): Promise<void> {
    this.todosLoading.set(true);
    const params = new HttpParams().set('status', status);
    try {

      const data = await firstValueFrom(
        this.http.get<Todo[]>(this.apiUrl, { params })
      );
      this.todos.update((prev: TodoList) => (
        {
          ...prev,
          [status]: data,
        }
      ));
    } catch (error) {
      console.log('Error fetching todos:', error);
    }
    this.todosLoading.set(false);
  }
}
