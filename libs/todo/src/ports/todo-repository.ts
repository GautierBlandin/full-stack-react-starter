import { Todo } from '../model/todo';

export interface TodoRepository {
  getAll(): Promise<Todo[]>;
  add(todo: Todo): Promise<void>;
}
