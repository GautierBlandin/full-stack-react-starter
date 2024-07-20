import { TodoRepository } from '../ports/todo-repository';
import { Todo } from '../model/todo';

export class InMemoryTodoRepository implements TodoRepository {
  private todos: Todo[] = [];

  async getAll(): Promise<Todo[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (this.todos.length === 0) {
      this.todos = [
        { message: 'Learn Next.js' },
        { message: 'Build a Todo App' },
        { message: 'Deploy to Vercel' },
      ];
    }

    return this.todos;
  }

  async setAll(todo: Todo[]): Promise<Todo[]> {
    // sleep for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.todos = todo;
    return this.todos;
  }
}
