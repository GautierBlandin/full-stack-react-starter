import { InMemoryTodoRepository } from '../infra/todo-repository';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TodoList } from '../ui/todo-list';
import { Todo } from '../model/todo';
import { TodosStoreProvider } from '../domain/todos.store-provider';

export function Todos() {
  const [todosRepository] = useState(() => new InMemoryTodoRepository());

  const query = useQuery({
    queryKey: ['todos'],
    queryFn: () => todosRepository.getAll(),
  })

  if (query.isLoading || query.data === undefined) {
    return <div>Loading...</div>
  }

  return (
    <TodosStoreProvider initialTodos={query.data} setAllTodos={(todos: Todo[]) => todosRepository.setAll(todos)}>
     <TodoList todos={query.data} />
    </TodosStoreProvider>
  );
}
