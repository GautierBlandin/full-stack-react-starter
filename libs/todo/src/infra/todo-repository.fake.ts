import { TodoOutput, TodoRepository } from '../ports/todo-repository';
import { Todo } from '../model/todo';

export class InMemoryTodoRepository implements TodoRepository {
  private todos: Todo[] = [];

  async getAll(): Promise<Todo[]> {
    return this.todos;
  }

  async setAll(todo: Todo[]): Promise<TodoOutput> {

    this.todos = todo;
    return {
      todos: this.todos,
      error: null,
    };
  }
}
