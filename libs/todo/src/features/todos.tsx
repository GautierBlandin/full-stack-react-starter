import { InMemoryTodoRepository } from '../infra/todo-repository';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TodoList } from '../ui/todo-list';

export function Todos() {
  const [todosRepository] = useState(() => new InMemoryTodoRepository());

  const query = useQuery({
    queryKey: ['todos'],
    queryFn: () => todosRepository.getAll(),
  })

  if (query.isLoading || query.data === undefined) {
    return <div>Loading...</div>
  }

  return <TodoList todos={query.data} />;
}
