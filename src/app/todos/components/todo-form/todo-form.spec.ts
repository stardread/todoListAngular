import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoForm } from './todo-form';

describe('TodoForm', () => {
  let component: TodoForm;
  let fixture: ComponentFixture<TodoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.errorMessage()).toBe('');
    expect(component.todo()).toBeNull();
    expect(component.isEditMode()).toBeFalse();
    expect(component.statuses.length).toBe(3);
    expect(component.todoForm().controls.title.value).toBe('');
    expect(component.todoForm().controls.description.value).toBe('');
    expect(component.todoForm().controls.status.value).toBe('todo');
  });

});
