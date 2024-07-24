import { Todo } from '../model/todo';

export type SuccessfulTodoOutput = {
  todos: Todo[];
  error: null;
}

export type FailedTodoOutput = {
  todos: null;
  error: string;
}

export type TodoOutput = SuccessfulTodoOutput | FailedTodoOutput;

export interface TodoRepository {
  getAll(): Promise<Todo[]>;
  setAll(todos: Todo[]): Promise<TodoOutput>;
}
