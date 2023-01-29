import { useSortable } from '@dnd-kit/sortable';
import Item from './item';
import useMountStatus from '../hooks/use-mount-status';
import { getColor } from '../utils';

// interface SortableItemProps {
//   containerId: string;
//   id: string;
//   index: number;
//   handle: boolean;
//   disabled?: boolean;
//   style(args: any): React.CSSProperties;
//   getIndex(id: string): number;
//   renderItem(): React.ReactElement;
//   wrapperStyle({ index }: { index: number }): React.CSSProperties;
// }

// function SortableItem({
//   disabled,
//   id,
//   index,
//   handle,
//   renderItem,
//   style,
//   containerId,
//   getIndex,
//   wrapperStyle,
// }: SortableItemProps) {
//   const {
//     setNodeRef,
//     listeners,
//     isDragging,
//     isSorting,
//     over,
//     overIndex,
//     transform,
//     transition,
//   } = useSortable({
//     id,
//   });
//   const mounted = useMountStatus();
//   const mountedWhileDragging = isDragging && !mounted;

//   return (
//     <Item
//       ref={disabled ? undefined : setNodeRef}
//       value={id}
//       dragging={isDragging}
//       sorting={isSorting}
//       handle={handle}
//       index={index}
//       wrapperStyle={wrapperStyle({ index })}
//       style={style({
//         index,
//         value: id,
//         isDragging,
//         isSorting,
//         overIndex: over ? getIndex(over.id) : overIndex,
//         containerId,
//       })}
//       color={getColor(id)}
//       transition={transition}
//       transform={transform}
//       fadeIn={mountedWhileDragging}
//       listeners={listeners}
//       renderItem={renderItem}
//     />
//   );
// }

interface SortableItemProps {
  containerId: string;
  id: string;
  index: number;
  handle: boolean;
  disabled?: boolean;
  data: CardItem;
  style(args: any): React.CSSProperties;
  getIndex(id: string): number;
  renderItem(): React.ReactElement;
  wrapperStyle({ index }: { index: number }): React.CSSProperties;
}

export default function SortableItem({
  disabled,
  id,
  index,
  handle,
  renderItem,
  style,
  data,
  containerId,
  getIndex,
  wrapperStyle,
}: SortableItemProps) {
  const {
    setNodeRef,
    listeners,
    isDragging,
    isSorting,
    over,
    overIndex,
    transform,
    transition,
  } = useSortable({
    id,
  });
  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  return (
    <Item
      ref={disabled ? undefined : setNodeRef}
      value={id}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      index={index}
      wrapperStyle={wrapperStyle({ index })}
      data={data}
      style={style({
        index,
        value: id,
        isDragging,
        isSorting,
        overIndex: over ? getIndex(over.id as string) : overIndex,
        containerId,
      })}
      color={getColor(id)}
      transition={transition}
      transform={transform}
      fadeIn={mountedWhileDragging}
      listeners={listeners}
      renderItem={renderItem}
    />
  );
}
