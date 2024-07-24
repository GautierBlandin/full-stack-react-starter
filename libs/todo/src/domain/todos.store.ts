import { createStore } from 'zustand';
import { Todo } from '../model/todo';
import { SuccessfulTodoOutput, TodoRepository } from '../ports/todo-repository';

export interface TodosProps {
  initialTodos: Todo[];
  todoRepository: TodoRepository;
  onSaveError: (error: string) => void;
}

type TodoState = {
  todos: Todo[];
  actions: Actions;
}

type Actions = {
  loadTodos: () => void;
  addTodo: () => Promise<void>;
  removeTodo: (index: number) => Promise<void>;
  editTodoMessage: (index: number, message: string) => Promise<void>;
  commitChanges: () => Promise<void>;
}

type Change = AddTodoChange | RemoveTodoChange | EditTodoChange;

type AddTodoChange = {
  type: 'TodoAdded'
}

type RemoveTodoChange = {
  type: 'TodoRemoved'
  index: number,
}

type EditTodoChange = {
  type: 'TodoEdited',
  index: number,
  message: string
}

function apply(todos: Todo[], change: Change): Todo[] {
  switch (change.type) {
    case 'TodoAdded':
      return [...todos, { message: ''}]
    case 'TodoRemoved':
      return todos.filter((_, i) => i !== change.index);
    case 'TodoEdited':
      return todos.map((todo, i) =>
        i === change.index ? { ...todo, message: change.message } : todo
      );
  }
}

function applyAll(todos: Todo[], changes: Change[]): Todo[] {
  return changes.reduce((todos, change) => apply(todos, change), todos);
}

export type TodosStore = ReturnType<typeof createTodosStore>;

export const createTodosStore = ({ todoRepository, onSaveError, initialTodos }: TodosProps) => {
  const changeSet: Change[] = [];

  return createStore<TodoState>((set, get) => ({
    todos: initialTodos,
    actions: {
      loadTodos: async () => {
        const todos = await todoRepository.getAll();
        set({todos})
      },
      addTodo: async () => {
        const state = get();
        const change: AddTodoChange = { type: 'TodoAdded' };
        changeSet.push(change);
        const newTodos = apply(state.todos, change);
        set({ todos: newTodos });
      },
      removeTodo: async (index: number) => {
        const state = get();
        const change: RemoveTodoChange = { type: 'TodoRemoved', index };
        changeSet.push(change);
        const newTodos = apply(state.todos, change);
        set({ todos: newTodos });

        state.actions.commitChanges();
      },
      editTodoMessage: async (index: number, message: string) => {
        const state = get();
        const change: EditTodoChange = { type: 'TodoEdited', index, message };
        changeSet.push(change);
        const newTodos = apply(state.todos, change);
        set({ todos: newTodos });

        state.actions.commitChanges();
      },
      commitChanges: async () => {
        const state = get();

        const changeSetLength = changeSet.length;
        const todoOutput = await todoRepository.setAll(state.todos);

        if (todoOutput.error) {
          onSaveError(todoOutput.error);
          return;
        }

        const newChanges = changeSet.slice(changeSetLength);
        const returnedTodos = (todoOutput as SuccessfulTodoOutput).todos;
        const updatedReturnedTodos = applyAll(returnedTodos, newChanges);
        set({ todos: updatedReturnedTodos });
      }
    },
  }))
}
