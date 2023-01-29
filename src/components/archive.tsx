import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';

// Archive component allow us to archive cards
// in a special column
// TODO: Implement logic in parent component
export default function Archive({ id }: { id: UniqueIdentifier }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center justify-center fixed left-1/2 bottom-5 w-[300px] h-[60px] rounded-md border ${
        isOver ? 'bg-blue-600' : 'bg-gray-400'
      }`}
    >
      Drop here to archive
    </div>
  );
}
