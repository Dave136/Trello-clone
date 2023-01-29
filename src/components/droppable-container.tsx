import {
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Container, Props as ContainerProps } from './container';

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  args.isSorting || args.wasDragging ? defaultAnimateLayoutChanges(args) : true;

export default function DroppableContainer({
  children,
  columns = 1,
  disabled,
  id,
  items,
  style,
  handle,
  ...props
}: ContainerProps & {
  disabled?: boolean;
  id: string;
  items: string[];
  style?: React.CSSProperties;
  handle?: boolean;
}) {
  const {
    active,
    attributes,
    isDragging,
    listeners,
    over,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id,
    data: {
      type: 'container',
    },
    animateLayoutChanges,
  });
  const included = items.includes(id);

  const isOverContainer = over
    ? (id === over.id && active?.data.current?.type !== 'container') || included
    : false;

  return (
    <Container
      ref={disabled ? undefined : setNodeRef}
      style={{
        ...style,
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
      hover={isOverContainer}
      handleProps={
        !handle
          ? undefined
          : {
              ...attributes,
              ...listeners,
            }
      }
      columns={columns}
      {...props}
    >
      {children}
    </Container>
  );
}
