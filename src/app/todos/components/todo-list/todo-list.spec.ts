import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, input, Input, signal } from '@angular/core';
import { TodoList } from './todo-list';
import { DataAccess } from '../../services/data-access';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { Todo as TodoModel } from '../../models/todo';
import { mockTodos } from '../../mocks/todos.mock';

/** Stub de l'enfant <app-todo> pour tester le rendu des titres */
@Component({
  selector: 'app-todo',
  standalone: true,
  template: `<div class="todo-stub">{{ todo()?.title}}</div>`,
})
class TodoStub {
  todo = input<TodoModel>();
}

/** Fake service pour contrôler le loader */
class FakeDataAccess {
  todosLoading = signal(false);
}

describe('TodoList', () => {
  let fixture: ComponentFixture<TodoList>;
  let component: TodoList;
  let dataAccess: FakeDataAccess;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // On importe le composant testé (standalone)
      imports: [TodoList],
      providers: [{ provide: DataAccess, useClass: FakeDataAccess }],
    })
      // On remplace l'import enfant par le stub (et on garde le spinner)
      .overrideComponent(TodoList, {
        set: { imports: [TodoStub, MatProgressSpinnerModule] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TodoList);
    component = fixture.componentInstance;
    dataAccess = TestBed.inject(DataAccess) as unknown as FakeDataAccess;
  });

  it('show spinner when todosLoading = true', () => {
    dataAccess.todosLoading.set(true);
    // pas besoin de fournir l’input dans ce cas
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();

    // Le contenu alternatif ne doit pas être affiché
    const emptyMsg = fixture.nativeElement.textContent as string;
    expect(emptyMsg.includes('Aucune tache disponible.')).toBeFalse();
  });

  it('show message when loading=false and empty list', () => {
    dataAccess.todosLoading.set(false);
    fixture.componentRef.setInput('todos', []);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Aucune tache disponible.');

    const items = fixture.debugElement.queryAll(By.css('.todo-stub'));
    expect(items.length).toBe(0);
  });

  it('show items when loading=false and list not empty', async() => {
    dataAccess.todosLoading.set(false);
    fixture.componentRef.setInput('todos', mockTodos);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.todo-stub'));
    expect(items.length).toBe(2);
    const firstText = items[0].nativeElement.textContent?.trim() ?? '';
    const secondText = items[1].nativeElement.textContent?.trim() ?? '';
    expect(firstText).toContain(mockTodos[0].title);
    expect(secondText).toContain(mockTodos[1].title);
  });

  it('update DOM when input todos change', () => {
    dataAccess.todosLoading.set(false);
    // liste pleine
    fixture.componentRef.setInput('todos', mockTodos);
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('.todo-stub')).length).toBe(2);

    // puis vide
    fixture.componentRef.setInput('todos', []);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.todo-stub')).length).toBe(0);
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Aucune tache disponible.');
  });
});
