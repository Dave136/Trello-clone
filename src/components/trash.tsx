import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';

// OLD
// function Trash({ id }: { id: UniqueIdentifier }) {
//   const { setNodeRef, isOver } = useDroppable({
//     id,
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         position: 'fixed',
//         left: '50%',
//         marginLeft: -150,
//         bottom: 20,
//         width: 300,
//         height: 60,
//         borderRadius: 5,
//         border: '1px solid',
//         borderColor: isOver ? 'red' : '#DDD',
//       }}
//     >
//       Drop here to delete
//     </div>
//   );
// }

// END OLD

export default function Trash({ id }: { id: UniqueIdentifier }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center justify-center fixed left-1/2 bottom-5 w-[300px] h-[60px] rounded-md border ${
        isOver ? 'bg-red-500' : 'bg-gray-400'
      }`}
    >
      Drop here to delete
    </div>
  );
}
