import { InMemoryTodoRepository } from '../infra/todo-repository';
import React, { useContext, useEffect, useState } from 'react';
import { TodoList } from '../ui/todo-list';
import { TodosStoreProvider } from '../domain/todos.store-provider';
import { TodosStoreContext } from '../domain/todos.store-context';
import { useStore } from 'zustand';
import { AddTodoButton } from '../ui/add-todo-button';
import { RemoveTodoButton } from '../ui/remove-todo-button';

function LoadedTodos() {
  const todosStore = useContext(TodosStoreContext);

  if (!todosStore) {
    throw new Error('TodosStore not found');
  }

  const { loaded, todos } = useStore(todosStore, (state) => ({
    loaded: state.loaded,
    todos: state.todos,
  }))
  const actions = useStore(todosStore, (state) => state.actions);

  useEffect(() => {
    actions.loadTodos();
  }, []);

  if (!loaded || !todos) {
    return <div>Loading...</div>
  }

  return (
    <>
      <TodoList todos={todos} onUpdateTodoMessage={(message, index) => actions.editTodoMessage(index, message)} />
      <AddTodoButton onClick={() => actions.addTodo({ message: 'New Todo' })} />
      <RemoveTodoButton onClick={() => actions.removeTodo(todos.length - 1)} />
    </>
  )
}

export function Todos() {
  const [todosRepository] = useState(() => new InMemoryTodoRepository());

  return (
    <TodosStoreProvider todoRepository={todosRepository}>
     <LoadedTodos />
    </TodosStoreProvider>
  );
}
