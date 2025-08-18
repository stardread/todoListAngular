import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Todo } from '../models/todo';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataAccess {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/tasks'; // TODO use .env file

  readonly todos = signal<Todo[]>([]);

  async getTodos(): Promise<void> {
    const data = await firstValueFrom(this.http.get<Todo[]>(this.apiUrl));
    this.todos.set(data);
    }

  }
