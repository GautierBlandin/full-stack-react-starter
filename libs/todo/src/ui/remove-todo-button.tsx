
export function RemoveTodoButton({ onClick }:  RemoveTodoButtonProps) {
  return (
    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={onClick}>
      Remove
    </button>
  );
}

interface RemoveTodoButtonProps {
  onClick: () => void;
}
