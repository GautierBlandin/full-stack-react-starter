import { createContext } from 'react';
import { TodosStore } from './todos.store';

export const TodosStoreContext = createContext<TodosStore | null>(null);
