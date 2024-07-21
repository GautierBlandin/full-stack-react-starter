import React from 'react';
import { Todo } from '../model/todo';
import { TodoCard } from './todo-card';

interface TodoListProps {
  todos: Todo[];
  onUpdateTodoMessage(message: string, index: number): void;
}

export function TodoList({ todos, onUpdateTodoMessage }: TodoListProps) {
  return (
    <div className="container mx-auto p-4">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">Todo List</h2>
  {todos.length === 0 ? (
    <p className="text-gray-600">No todos yet. Add some!</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {todos.map((todo, index) => (
          <TodoCard key={index} todo={todo} onBlur={(message) => onUpdateTodoMessage(message, index)} />
  ))}
    </div>
  )}
  </div>
);
}
