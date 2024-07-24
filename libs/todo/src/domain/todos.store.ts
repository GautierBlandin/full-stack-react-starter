import { createStore } from 'zustand';
import { Todo } from '../model/todo';
import { SuccessfulTodoOutput, TodoRepository } from '../ports/todo-repository';

export interface TodosProps {
  todoRepository: TodoRepository;
  onSaveError: (error: string) => void;
}

type LoadedState = {
  loaded: true;
  todos: Todo[];
} & CommonState;

type LoadingState = {
  loaded: false;
  todos: null;
} & CommonState;

type CommonState = {
  actions: Actions;
}

type Actions = {
  loadTodos: () => void;
  addTodo: (todo: Todo) => void;
  removeTodo: (index: number) => void;
  editTodoMessage: (index: number, message: string) => void;
  commitChanges: () => void;
}

type TodoState = LoadedState | LoadingState;

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

type Change = AddTodoChange | RemoveTodoChange | EditTodoChange;

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

function assertLoaded(state: TodoState): asserts state is LoadedState {
  if (!state.loaded) {
    throw new Error('TodosStore not loaded');
  }
}

export const createTodosStore = ({ todoRepository, onSaveError }: TodosProps) => {
  const changeSet: Change[] = [];
  let lastCommitedState
  let commitedIndex = 0;

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
        const change: AddTodoChange = { type: 'TodoAdded' };
        changeSet.push(change);
        const newTodos = apply(state.todos, change);
        set({ todos: newTodos });
      },
      removeTodo: async (index: number) => {
        const state = get();
        assertLoaded(state);
        const change: RemoveTodoChange = { type: 'TodoRemoved', index };
        changeSet.push(change);
        const newTodos = apply(state.todos, change);
        set({ todos: newTodos });

        state.actions.commitChanges();
      },

      editTodoMessage: async (index: number, message: string) => {
        const state = get();
        assertLoaded(state);
        const change: EditTodoChange = { type: 'TodoEdited', index, message };
        changeSet.push(change);
        const newTodos = apply(state.todos, change);
        set({ todos: newTodos });

        state.actions.commitChanges();
      },
      commitChanges: async () => {
        const state = get();
        assertLoaded(state);

        const changeSetLength = changeSet.length;
        const todoOutput = await todoRepository.setAll(state.todos);

        if (todoOutput.error) {
          onSaveError(todoOutput.error);
          return;
        }

        commitedIndex = changeSetLength;
        const newChanges = changeSet.slice(changeSetLength);
        const returnedTodos = (todoOutput as SuccessfulTodoOutput).todos;
        lastCommitedState = returnedTodos;
        const updatedReturnedTodos = applyAll(returnedTodos, newChanges);
        set({ todos: updatedReturnedTodos });
      }
    },
  }))
}
