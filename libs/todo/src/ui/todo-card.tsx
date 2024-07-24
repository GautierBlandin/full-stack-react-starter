import React, { useState, useEffect } from 'react';
import { Todo } from '../model/todo';

interface TodoCardProps {
  todo: Todo;
  onBlur: (updatedTodoMessage: string) => void;
}

export function TodoCard({ todo, onBlur }: TodoCardProps) {
  const [message, setMessage] = useState(todo.message);

  useEffect(() => {
    setMessage(todo.message);
  }, [todo.message]);

  const handleBlur = () => {
    if (message !== todo.message) {
      onBlur(message);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 m-2 max-w-sm">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onBlur={handleBlur}
        className="w-full mt-2 text-gray-600 text-sm border-b border-gray-300 focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}
