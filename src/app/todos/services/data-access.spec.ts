import { TestBed } from '@angular/core/testing';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DataAccess } from './data-access';
import { provideHttpClient } from '@angular/common/http';
import { mockTodos } from '../mocks/todos.mock';

describe('DataAccess', () => {
  let service: DataAccess;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/tasks';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [DataAccess, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DataAccess);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch todos by status and update signal', async () => {
    const promise = service.getTodosByStatus('todo');

    const req = httpMock.expectOne(
      (req) => req.url === apiUrl && req.params.get('status') === 'todo'
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockTodos);

    await promise;

    expect(service.todos().todo).toEqual(mockTodos);
    expect(service.todos().inProgress).toEqual([]);
    expect(service.todos().done).toEqual([]);
  });

  it('should handle empty response', async () => {
    const promise = service.getTodosByStatus('todo');

    const req = httpMock.expectOne(
      (req) => req.url === apiUrl && req.params.get('status') === 'todo'
    );

    req.flush([]);
    await promise;

    expect(service.todos().todo).toEqual([]);
  });

  it('should handle error response', async () => {
    const logSpy = spyOn(console, 'log');
    const promise = service.getTodosByStatus('todo');
    expect(service.todosLoading()).toBeTrue();

    const req = httpMock.expectOne(
      (req) => req.url === apiUrl && req.params.get('status') === 'todo'
    );

    req.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expectAsync(promise).toBeResolved();
    expect(service.todosLoading()).toBeFalse();
    expect(service.todos().todo).toEqual([]);
    expect(logSpy).toHaveBeenCalled();
  });
});
