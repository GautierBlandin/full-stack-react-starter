import { createStore } from 'zustand';
import { Todo } from '../model/todo';
import { TodoRepository } from '../ports/todo-repository';

export interface TodosProps {
  todoRepository: TodoRepository;
}

type LoadedState = {
  loaded: true;
  todos: Todo[];
  actions: Actions;
}

type LoadingState = {
  loaded: false;
  todos: null;
  actions: Actions;
}

type TodoState = LoadedState | LoadingState;

type Actions = {
  loadTodos: () => void;
  addTodo: (todo: Todo) => void;
  removeTodo: (index: number) => void;
  editTodoMessage: (index: number, message: string) => void;
}

export type TodosStore = ReturnType<typeof createTodosStore>;

function assertLoaded(state: TodoState): asserts state is LoadedState {
  if (!state.loaded) {
    throw new Error('TodosStore not loaded');
  }
}

export const createTodosStore = ({ todoRepository }: TodosProps) => {
  return createStore<TodoState>((set, get) => ({
    loaded: false,
    todos: null,
    actions: {
      loadTodos: async () => {
        const todos = await todoRepository.getAll();
        set({loaded: true, todos})
      },
      addTodo: async (todo: Todo) => {
        const state = get();
        assertLoaded(state);
        const newTodos = [...state.todos, todo];
        set({ todos: newTodos });
        const returnedTodos = await todoRepository.setAll(newTodos);
        set({ todos: returnedTodos });
      },
      removeTodo: async (index: number) => {
        const state = get();
        assertLoaded(state);
        const newTodos = state.todos.filter((_, i) => i !== index);
        set({ todos: newTodos });
        const returnedTodos = await todoRepository.setAll(newTodos);
        set({ todos: returnedTodos });
      },
      editTodoMessage: async (index: number, message: string) => {
        const state = get();
        assertLoaded(state);
        const newTodos = state.todos.map((todo, i) =>
          i === index ? { ...todo, message } : todo
        );
        set({ todos: newTodos });
        const returnedTodos = await todoRepository.setAll(newTodos);
        set({ todos: returnedTodos });
      },
    },
  }))
}
