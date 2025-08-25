import { Todo } from "./todo";

export interface TodoList {
  todo: Todo[];
  inProgress: Todo[];
  done: Todo[];
}
