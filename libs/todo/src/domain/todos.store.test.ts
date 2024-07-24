import { createTodosStore } from './todos.store';
import { InMemoryTodoRepository } from '../infra/todo-repository.fake';

describe('todos store', () => {
  it('should add a todo', async () => {
    const { todoStore } = setup();


    await todoStore.getState().actions.addTodo();
    expect(todoStore.getState().todos).toEqual([{ message: '' }]);
  });
});

const setup = () => {
  const errors: string[] = [];

  const todoStore = createTodosStore({
    todoRepository: new InMemoryTodoRepository(),
    onSaveError: (error) => errors.push(error),
    initialTodos: [],
  });

  return {
    todoStore,
    errors,
  };
}
