import { Todo } from '../model/todo';

export interface TodoRepository {
  getAll(): Promise<Todo[]>;
  setAll(todos: Todo[]): Promise<Todo[]>;
}
