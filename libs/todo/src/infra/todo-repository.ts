import { TodoRepository } from '../ports/todo-repository';
import { Todo } from '../model/todo';

export class InMemoryTodoRepository implements TodoRepository {
  private todos: Todo[] = [];

  async getAll(): Promise<Todo[]> {
    return this.todos;
  }

  async add(todo: Todo): Promise<void> {
    this.todos.push(todo);
  }
}
