import { createStore } from 'zustand';
import { Todo } from '../model/todo';

export interface TodosProps {
  initialTodos: Todo[];
  setAllTodos: (todos: Todo[]) => Promise<Todo[]>;
}

type TodoState = {
  todos: Todo[];
  actions: {
    addTodo: (todo: Todo) => void;
    removeTodo: (index: number) => void;
    editTodoMessage: (index: number, message: string) => void;
  }
}

export type TodosStore = ReturnType<typeof createTodosStore>;

export const createTodosStore = ({ initialTodos, setAllTodos }: TodosProps) => {
  return createStore<TodoState>((set, get) => ({
    _initialized: false,
    todos: initialTodos,
    actions: {
      addTodo: async (todo: Todo) => {
        const returnedTodos = await setAllTodos([...get().todos, todo]);
        set({ todos: returnedTodos });
      },
      removeTodo: async (index: number) => {
        const newTodos = get().todos.filter((_, i) => i !== index);
        const returnedTodos = await setAllTodos(newTodos);
        set({ todos: returnedTodos });
      },
      editTodoMessage: async (index: number, message: string) => {
        const newTodos = get().todos.map((todo, i) =>
          i === index ? { ...todo, message } : todo
        );
        const returnedTodos = await setAllTodos(newTodos);
        set({ todos: returnedTodos });
      },
    },
  }))
}
