import React, { PropsWithChildren} from 'react';
import { useRef } from 'react';
import { createTodosStore, TodosProps } from './todos.store';
import { TodosStoreContext } from './todos.store-context';

type TodosProviderProps = PropsWithChildren<TodosProps>;

export function TodosStoreProvider({ children }: TodosProviderProps) {
  const todosStore = useRef(createTodosStore());

  return (
    <TodosStoreContext.Provider value={todosStore.current}>
      {children}
    </TodosStoreContext.Provider>
  );
}
