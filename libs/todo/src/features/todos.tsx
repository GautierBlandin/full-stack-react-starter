import { LocalStorageTodoRepository } from '../infra/todo-repository';
import React, { useRef, useState } from 'react';
import { TodoList } from '../ui/todo-list';
import { useStore } from 'zustand';
import { AddTodoButton } from '../ui/add-todo-button';
import { RemoveTodoButton } from '../ui/remove-todo-button';
import { createTodosStore } from '../domain/todos.store';
import { useQuery } from '@tanstack/react-query';
import { Todo } from '../model/todo';

function Todos({ serverTodos }: { serverTodos: Todo[] }) {
  const onSaveError = (error: string) => {
    console.error(error);
  }

  const todosStore = useRef(createTodosStore({
    onSaveError,
    initialTodos: serverTodos,
    todoRepository: new LocalStorageTodoRepository()
  }));

  const { todos } = useStore(todosStore.current, (state) => ({
    todos: state.todos,
  }))
  const actions = useStore(todosStore.current, (state) => state.actions);

  return (
    <>
      <TodoList todos={todos} onUpdateTodoMessage={(message, index) => actions.editTodoMessage(index, message)} />
      <AddTodoButton onClick={() => actions.addTodo({ message: 'New Todo' })} />
      <RemoveTodoButton onClick={() => actions.removeTodo(todos.length - 1)} />
    </>
  )
}

export function TodoLoader() {
  const [todoRepository] = useState(() => new LocalStorageTodoRepository());

  const { data: loadedTodos } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      return await todoRepository.getAll();
    },
  });

  if (!loadedTodos) {
    return <div>Loading...</div>
  }

  return (
    <Todos serverTodos={loadedTodos} />
  )
}
