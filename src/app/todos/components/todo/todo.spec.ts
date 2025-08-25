import { mockTodos } from './../../mocks/todos.mock';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Todo } from './todo';
import { By } from '@angular/platform-browser';
import { Status } from '../../enums/status';

describe('Todo', () => {
  let component: Todo;
  let fixture: ComponentFixture<Todo>;
  const mockTodo = mockTodos[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Todo],
    }).compileComponents();

    fixture = TestBed.createComponent(Todo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title and description and show the Modifier button', async () => {
    fixture.componentRef.setInput('todo', mockTodo);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const titleEl = fixture.debugElement.query(By.css('mat-card-title'));
    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.textContent).toContain(mockTodo.title);

    const descEl = fixture.debugElement.query(By.css('mat-card-content p'));
    expect(descEl).toBeTruthy();
    expect(descEl.nativeElement.textContent).toContain(mockTodo.description);

    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn).toBeTruthy();
    expect((btn.nativeElement.textContent || '').trim()).toContain('Modifier');
  });

  it('should display a done card', async () => {
    fixture.componentRef.setInput('todo', { ...mockTodo, status: Status[2] });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('mat-card'));
    expect(card).toBeTruthy();

    const expectedClass = `done-bg`;
    const hasClass = card.nativeElement.classList.contains(expectedClass);
    expect(hasClass).toBeTrue();
  });

  it('should display a todo card', async () => {
    fixture.componentRef.setInput('todo', { ...mockTodo, status: Status[0] });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('mat-card'));
    expect(card).toBeTruthy();

    const expectedClass = `todo-bg`;
    const hasClass = card.nativeElement.classList.contains(expectedClass);
    expect(hasClass).toBeTrue();
  });

  it('should display a inProgress card', async () => {
    fixture.componentRef.setInput('todo', { ...mockTodo, status: Status[1] });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('mat-card'));
    expect(card).toBeTruthy();
    const expectedClass = `inProgress-bg`;
    const hasClass = card.nativeElement.classList.contains(expectedClass);
    expect(hasClass).toBeTrue();
  });

  it('getStatusIcon should return the correct icon for each status', () => {
    // todo
    fixture.componentRef.setInput('todo', { ...mockTodo, status: Status[0] });
    expect(component.getStatusIcon()).toBe('pending_actions');

    // inProgress
    fixture.componentRef.setInput('todo', { ...mockTodo, status: Status[1] });
    expect(component.getStatusIcon()).toBe('hourglass_empty');

    // done
    fixture.componentRef.setInput('todo', { ...mockTodo, status: Status[2] });
    expect(component.getStatusIcon()).toBe('check_box');
  });
});
