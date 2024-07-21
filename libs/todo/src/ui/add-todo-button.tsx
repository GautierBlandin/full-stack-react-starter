export function AddTodoButton({ onClick }: AddTodoButtonProps) {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={onClick}
    >
      Add Todo
    </button>
  );
}

interface AddTodoButtonProps {
  onClick: () => void;
}
