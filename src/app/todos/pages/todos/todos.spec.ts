import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { Todos } from './todos';
import { DataAccess } from '../../services/data-access';
import { Status } from '../../enums/status';
import { mockTodos } from '../../mocks/todos.mock';

describe('Todos Component', () => {
  let fixture: ComponentFixture<Todos>;
  let component: Todos;
  let dataAccess: DataAccess;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Todos],
      providers: [DataAccess, provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Todos);
    component = fixture.componentInstance;
    dataAccess = TestBed.inject(DataAccess);

    // Mock le signal todosLoading et getTodosByStatus
    spyOn(dataAccess, 'getTodosByStatus').and.callFake(
      async () => {
        dataAccess.todos.set({ todo: mockTodos, inProgress: [], done: [] });
      }
    );
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call refreshTodos on ngOnInit with the first status', async () => {
    const refreshSpy = spyOn(component, 'refreshTodos').and.callThrough();
    component.ngOnInit();
    expect(refreshSpy).toHaveBeenCalledWith(Status[0]);
    await fixture.whenStable();
    expect(dataAccess.getTodosByStatus).toHaveBeenCalledWith(Status[0]);
  });

  it('should call refreshTodos on tab change with correct status', async () => {
    const refreshSpy = spyOn(component, 'refreshTodos').and.callThrough();
    const event = { index: 1 };
    component.onTabChange(event);
    expect(refreshSpy).toHaveBeenCalledWith(Status[1]);
    await fixture.whenStable();
    expect(dataAccess.getTodosByStatus).toHaveBeenCalledWith(Status[1]);
  });

  it('should update todos signal after refreshTodos', async () => {
    await component.refreshTodos('todo');
    expect(component.todosService.todos().todo).toEqual(mockTodos);
    expect(component.todosService.todos().inProgress).toEqual([]);
    expect(component.todosService.todos().done).toEqual([]);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain(mockTodos[0].title);
  });
});
