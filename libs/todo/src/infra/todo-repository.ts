import { TodoRepository } from '../ports/todo-repository';
import { Todo } from '../model/todo';

export class InMemoryTodoRepository implements TodoRepository {
  private todos: Todo[] = [];

  async getAll(): Promise<Todo[]> {
    return this.todos;
  }

  async setAll(todo: Todo[]): Promise<Todo[]> {
    // sleep for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.todos = todo;
    return this.todos;
  }
}
