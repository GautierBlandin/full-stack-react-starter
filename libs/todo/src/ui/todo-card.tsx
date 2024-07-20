import React from 'react';
import { Todo } from '../model/todo';

interface TodoCardProps {
  todo: Todo;
}

export function TodoCard({ todo }: TodoCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 m-2 max-w-sm">
      <p className="mt-2 text-gray-600 text-sm">
        {todo.message}
      </p>
    </div>
  );
}
