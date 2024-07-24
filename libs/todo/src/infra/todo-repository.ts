import { TodoOutput, TodoRepository } from '../ports/todo-repository';
import { Todo } from '../model/todo';

export class LocalStorageTodoRepository implements TodoRepository {
  private readonly storageKey = 'todos';

  async getAll(): Promise<Todo[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const storedTodos = localStorage.getItem(this.storageKey);
    return storedTodos ? JSON.parse(storedTodos) : [];
  }

  async setAll(todos: Todo[]): Promise<TodoOutput> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!this.validateTodos(todos)) {
      return { todos: null, error: 'Invalid Todos' };
    }

    const updatedTodos = [...todos];
    if (updatedTodos.length > 0) {
      updatedTodos[0].message = updatedTodos[0].message + 'b';
    }

    localStorage.setItem(this.storageKey, JSON.stringify(updatedTodos));

    return {
      todos: updatedTodos,
      error: null,
    };
  }

  private validateTodos(todos: Todo[]): boolean {
    return todos.every((todo) => todo.message.length > 0);
  }
}
