import { createStore } from 'zustand';
import { Todo } from '../model/todo';

export interface TodosProps {
  initialTodos: Todo[];
  setAllTodos: (todos: Todo[]) => Promise<Todo[]>;
}

type CommonActions = {
  initialize: (todosProps: TodosProps) => void;
  synchronizeTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  removeTodo: (index: number) => void;
  editTodoMessage: (index: number, message: string) => void;
}

type InitializedTodoState = {
  _initialized: true;
  todos: Todo[];
  actions: CommonActions & {
    _setAllTodos: (todos: Todo[]) => Promise<Todo[]>;
  }
}

type PendingTodoState = {
  _initialized: false;
  todos: null;
  actions: CommonActions &{
    _setAllTodos: null;
  }
}

type TodosState = InitializedTodoState | PendingTodoState;

function assertInitializedTodoState(state: TodosState): asserts state is InitializedTodoState {
  if (!state._initialized) {
    throw new Error('TodosStore is not initialized');
  }
}

export type TodosStore = ReturnType<typeof createTodosStore>;

export const createTodosStore = () => {
  return createStore<TodosState>((set, get) => ({
    _initialized: false,
    todos: null,
    actions: {
      initialize: (todosProps: TodosProps) => {
        const state = get();
        if (state._initialized) {
          throw new Error('TodosStore is already initialized');
        }
        set({
          _initialized: true,
          todos: todosProps.initialTodos,
          actions: {
            ...state.actions,
            _setAllTodos: todosProps.setAllTodos,
          }
        });
      },
      synchronizeTodos: async (todos: Todo[]) => {
        const state = get();
        assertInitializedTodoState(state);
        set({todos});
      },
      addTodo: async (todo: Todo) => {
        const state = get();
        assertInitializedTodoState(state);
        const newTodos = [...state.todos, todo];
        const returnedTodos = await state.actions._setAllTodos(newTodos);
        set({todos: returnedTodos});
      },
      removeTodo: async (index: number) => {
        const state = get();
        assertInitializedTodoState(state);
        const newTodos = state.todos.filter((_, i) => i !== index);
        const returnedTodos = await state.actions._setAllTodos(newTodos);
        set({todos: returnedTodos});
      },
      editTodoMessage: async (index: number, message: string) => {
        const state = get();
        assertInitializedTodoState(state);
        const newTodos = state.todos.map((todo, i) => i === index ? { ...todo, message } : todo);
        const returnedTodos = await state.actions._setAllTodos(newTodos);
        set({todos: returnedTodos});
      },
      _setAllTodos: null,
    },
  }))
}
