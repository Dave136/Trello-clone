import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal, unstable_batchedUpdates } from 'react-dom';
import { toast } from 'react-toastify';
import {
  CancelDrop,
  closestCenter,
  rectIntersection,
  CollisionDetection,
  DndContext,
  DragOverlay,
  DropAnimation,
  defaultDropAnimation,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  Modifiers,
  UniqueIdentifier,
  useSensors,
  useSensor,
  MeasuringStrategy,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  SortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import Item from './item';
import { Container } from './container';
import { getColor } from '../utils';
import DroppableContainer from './droppable-container';
import Trash from './trash';
import SortableItem from './sortable-item';
import ColumnModal from './column-modal';
import TaskModal from './task-modal';
import RemoveColumnModal from './remove-column-modal';
import useBoardStore from '../store/board';

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
};

interface Props {
  id: string;
  adjustScale?: boolean;
  cancelDrop?: CancelDrop;
  columns?: number;
  containerStyle?: React.CSSProperties;
  getItemStyles?(args: {
    value: UniqueIdentifier;
    index: number;
    overIndex: number;
    isDragging: boolean;
    containerId: UniqueIdentifier;
    isSorting: boolean;
    isDragOverlay: boolean;
  }): React.CSSProperties;
  wrapperStyle?(args: { index: number }): React.CSSProperties;
  itemCount?: number;
  items?: BoardItem[];
  handle?: boolean;
  renderItem?: any;
  strategy?: SortingStrategy;
  modifiers?: Modifiers;
  minimal?: boolean;
  trashable?: boolean;
  scrollable?: boolean;
  vertical?: boolean;
}

export const TRASH_ID = 'void';
export const ARCHIVE_ID = 'archive';
const PLACEHOLDER_ID = 'placeholder';
const empty: UniqueIdentifier[] = [];

export default function DropContainers({
  id: parentId,
  adjustScale = false,
  itemCount = 3,
  cancelDrop,
  columns,
  handle = false,
  items: initialItems,
  containerStyle,
  getItemStyles = () => ({}),
  wrapperStyle = () => ({}),
  minimal = false,
  modifiers,
  renderItem,
  strategy = verticalListSortingStrategy,
  trashable = false,
  vertical = false,
  scrollable,
}: Props) {
  const [items, setItems] = useState<BoardItem[]>(initialItems as BoardItem[]);
  const boardStore = useBoardStore();

  const [containers, setContainers] = useState(
    Object.values(items).map((item: any) => item.id)
  );

  const [tempContainerId, setTempContainerId] = useState('');

  const openColumnModalRef = useRef<HTMLAnchorElement | null>(null);
  const closeColumnModalRef = useRef<HTMLAnchorElement | null>(null);

  const openTaskModalRef = useRef<HTMLAnchorElement | null>(null);
  const closeTaskModalRef = useRef<HTMLAnchorElement | null>(null);

  const openRemoveModalRef = useRef<HTMLAnchorElement | null>(null);
  const closeRemoveModalRef = useRef<HTMLAnchorElement | null>(null);

  const [activeId, setActiveId] = useState<string | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const isSortingContainer = activeId ? containers.includes(activeId) : false;
  // Custom collision detection strategy optimized for multiple containers
  // @ts-ignore
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      // Start by finding any intersecting droppable
      let overId = rectIntersection(args);

      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items
          ),
        });
      }

      if (overId != null) {
        if ((overId as unknown as string) === TRASH_ID) {
          // If the intersecting droppable is the trash, return early
          // Remove this if you're not using trashable functionality in your app
          return overId;
        }

        if (
          Object.values(items).filter(
            (item) => item.id === (overId as unknown as string)
          ).length
        ) {
          const containerItems = Object.values(items).map((item) => item.id);

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== (overId as unknown as string) &&
                  containerItems.includes(container.id as string)
              ),
            });
          }
        }

        lastOverId.current = overId as unknown as string;

        return overId;
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current;
    },
    [activeId, items]
  );

  const [clonedItems, setClonedItems] = useState<any | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id: string) => {
    if (Object.values(items).filter((item) => item.id === id).length) {
      return id;
    }

    const found = Object.values(items).find(({ cards }) =>
      cards.find((card) => card.id === id)
    );

    return found!.id;
  };

  const getIndex = (id: string) => {
    const container = findContainer(id);

    if (!container) {
      return -1;
    }

    return Object.values(items).findIndex((item) => item.id === container);
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
    setClonedItems(items);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const overId = over?.id;

    if (!overId || overId === TRASH_ID || active.id in items) {
      return;
    }

    const overContainer = findContainer(overId as string);
    const activeContainer = findContainer(active.id as string);

    if (!overContainer || !activeContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      // @ts-ignore
      setItems((items) => {
        const activeItems = Object.values(items).find(
          (item) => item.id === activeContainer
        );
        const overItems = Object.values(items).find(
          (item) => item.id === overContainer
        );

        const overIndex = overItems!.cards.findIndex(
          (card) => card.id === overId
        );
        const activeIndex = activeItems!.cards.findIndex(
          (card) => card.id === active.id
        );

        let newIndex: number;

        if (Object.values(items).find((item) => item.id === overId)) {
          newIndex = overItems!.cards.length + 1;
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            // @ts-ignore
            active.rect.current.translated.offsetTop >
              // @ts-ignore
              over.rect.offsetTop + over.rect.height;

          const modifier = isBelowOverItem ? 1 : 0;

          newIndex =
            overIndex >= 0 ? overIndex + modifier : overItems!.cards.length + 1;
        }

        recentlyMovedToNewContainer.current = true;

        const activeContainerIndex = Object.values(items).findIndex(
          (item) => item.id === activeContainer
        );
        const overContainerIndex = Object.values(items).findIndex(
          (item) => item.id === overContainer
        );

        const activeContainerObject = Object.values(items).find(
          (item) => item.id === activeContainer
        );

        const overContainerObject = Object.values(items).find(
          (item) => item.id === overContainer
        );

        const result = {
          ...items,
          [activeContainerIndex]: {
            ...activeContainerObject,
            cards: activeContainerObject!.cards.filter(
              (item) => item.id !== active.id
            ),
          },
          [overContainerIndex]: {
            ...overContainerObject,
            cards: [
              ...overContainerObject!.cards.slice(0, newIndex),
              activeContainerObject!.cards[activeIndex],
              ...overContainerObject!.cards.slice(
                newIndex,
                overContainerObject!.cards.length
              ),
            ],
          },
        };

        return result;
      });
      boardStore.update(parentId, { items });
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeContainer = findContainer(active.id as string);

    if (!activeContainer) {
      setActiveId(null);
      return;
    }

    const overId = over?.id;

    if (!overId) {
      setActiveId(null);
      return;
    }

    if (overId === TRASH_ID) {
      // TODO: Trash tasks
      return;
    }

    const overContainer = findContainer(overId as string);

    if (overContainer) {
      const activeIndex = Object.values(items)
        .flatMap((item) => item.cards)
        .findIndex((card) => card.id === active.id);
      const overIndex = Object.values(items)
        .flatMap((item) => item.cards)
        .findIndex((card) => card.id === overId);
      const overContainerIndex = Object.values(items).findIndex(
        (item) => item.id === overContainer
      );
      const overContainerObject = Object.values(items).find(
        (item) => item.id === overContainer
      );

      if (activeIndex !== overIndex) {
        // @ts-ignore
        setItems((items) => {
          const result = {
            ...items,
            [overContainerIndex]: {
              ...overContainerObject,
              cards: arrayMove(
                overContainerObject!.cards,
                activeIndex - 1,
                overIndex - 1
              ),
            },
          };

          return result;
        });

        boardStore.update(parentId, { items });
      }
    }

    setActiveId(null);
  };

  const onDragCancel = () => {
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containrs
      setItems(clonedItems);
      boardStore.update(parentId, { items });
    }

    setActiveId(null);
    setClonedItems(null);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      cancelDrop={cancelDrop}
      onDragCancel={onDragCancel}
      modifiers={modifiers}
    >
      <div
        className={`inline-grid box-border p-5 ${
          vertical ? 'grid-flow-row' : 'grid-flow-col'
        }`}
      >
        <SortableContext
          items={[...containers, PLACEHOLDER_ID]}
          strategy={
            vertical
              ? verticalListSortingStrategy
              : horizontalListSortingStrategy
          }
        >
          {containers.map((containerId) => (
            <DroppableContainer
              key={containerId}
              id={containerId}
              label={
                minimal
                  ? undefined
                  : // @ts-ignore
                    Object.values(items)!.find(
                      (item) => item.id === containerId
                    ).name
              }
              columns={columns}
              items={containers}
              scrollable={scrollable}
              style={containerStyle}
              unstyled={minimal}
              onRemove={() => {
                setTempContainerId(containerId);
                openRemoveModalRef.current?.click();
              }}
            >
              <SortableContext
                items={
                  // @ts-ignore
                  Object.values(items).find((item) => item.id === containerId)
                    .cards
                }
                strategy={strategy}
              >
                {Object.values(items)
                  .find((item) => item.id === containerId)
                  ?.cards.map((data, index) => {
                    return (
                      <SortableItem
                        disabled={isSortingContainer}
                        key={data.id}
                        id={data?.id}
                        index={index}
                        handle={handle}
                        style={getItemStyles}
                        data={data}
                        wrapperStyle={wrapperStyle}
                        renderItem={renderItem}
                        containerId={containerId}
                        getIndex={getIndex}
                      />
                    );
                  })}
                <button
                  className="btn btn-link text-gray-500"
                  onClick={() => {
                    setTempContainerId(containerId);
                    openTaskModalRef.current?.click();
                  }}
                >
                  Click to add task
                </button>
              </SortableContext>
            </DroppableContainer>
          ))}
          {minimal ? undefined : (
            <DroppableContainer
              id={PLACEHOLDER_ID}
              disabled
              items={empty as string[]}
              onClick={() => openColumnModalRef.current?.click()}
              placeholder
              className="self-start"
            >
              <div className="w-full h-[100px] flex items-center justify-center">
                <button className="btn btn-ghost btn-link text-gray-500">
                  + Add item
                </button>
              </div>
            </DroppableContainer>
          )}
        </SortableContext>
      </div>
      {createPortal(
        <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
          {activeId
            ? containers.includes(activeId)
              ? renderContainerDragOverlay(activeId)
              : renderSortableItemDragOverlay(activeId)
            : null}
        </DragOverlay>,
        document.body
      )}
      {createPortal(
        <>
          <ColumnModal
            action={handleAddColumn}
            closeRef={closeColumnModalRef}
          />
          <TaskModal
            action={(payload) => handleAddItem(payload)}
            closeRef={closeTaskModalRef}
          />
          <RemoveColumnModal
            action={handleRemoveColumn}
            closeRef={closeRemoveModalRef}
          />
          <a
            href="#new-column"
            className="hidden"
            ref={openColumnModalRef}
            hidden
          />
          <a
            href="#new-task"
            className="hidden"
            ref={openTaskModalRef}
            hidden
          />
          <a
            href="#remove-column"
            className="hidden"
            ref={openRemoveModalRef}
            hidden
          />
        </>,
        document.body
      )}
      {trashable && activeId && !containers.includes(activeId) ? (
        <Trash id={TRASH_ID} />
      ) : null}
    </DndContext>
  );

  function renderSortableItemDragOverlay(id: string) {
    const data = Object.values(items)
      .flatMap((item) => item.cards)
      .find((card) => card.id === id);

    return (
      <Item
        value={id}
        handle={handle}
        data={data as CardItem}
        style={getItemStyles({
          containerId: findContainer(id) as string,
          overIndex: -1,
          index: getIndex(id),
          value: id,
          isSorting: true,
          isDragging: true,
          isDragOverlay: true,
        })}
        color={getColor(id)}
        wrapperStyle={wrapperStyle({ index: 0 })}
        renderItem={renderItem}
        dragOverlay
      />
    );
  }

  function renderContainerDragOverlay(containerId: string) {
    const container = Object.values(items).find(
      (item) => item.id === containerId
    );

    return (
      <Container
        label={containerId}
        columns={columns}
        style={{
          height: '100%',
        }}
        shadow
        unstyled={false}
      >
        {container!.cards.map((item, index) => (
          <Item
            key={item.id}
            value={item.id}
            handle={handle}
            data={item}
            style={getItemStyles({
              containerId,
              overIndex: -1,
              index: getIndex(item.id),
              value: item.id,
              isDragging: false,
              isSorting: false,
              isDragOverlay: false,
            })}
            color={getColor(item.label)}
            wrapperStyle={wrapperStyle({ index })}
            renderItem={renderItem}
          />
        ))}
      </Container>
    );
  }

  async function handleAddItem(payload: any) {
    const container = Object.values(items).find(
      (item) => item.id === tempContainerId
    );
    const containerIndex = Object.values(items).findIndex(
      (item) => item.id === tempContainerId
    );

    // @ts-ignore
    setItems((items) => {
      const result = {
        ...items,
        [containerIndex]: {
          ...container,
          cards: container!.cards.concat({
            id: crypto.randomUUID(),
            title: payload.title,
            label: payload.label,
            description: payload.description,
          }),
        },
      };
      return result;
    });

    closeTaskModalRef.current?.click();
    setTempContainerId('');
    boardStore.update(parentId, { items });
  }

  async function handleAddColumn(name: string) {
    const id = crypto.randomUUID();

    closeColumnModalRef.current?.click();

    unstable_batchedUpdates(() => {
      setContainers((containers) => [...containers, id]);
      setItems((items) => ({
        ...items,
        [Object.values(items).length + 1]: {
          id,
          name,
          cards: [],
        },
      }));
    });

    boardStore.update(parentId, { items });
  }

  async function handleRemoveColumn(result: boolean) {
    if (!result) {
      closeRemoveModalRef.current?.click();
      setTempContainerId('');
      return;
    }

    setContainers((containers) =>
      containers.filter((id) => id !== tempContainerId)
    );

    closeRemoveModalRef.current?.click();
    setTempContainerId('');
    toast.success('Column removed');
  }
}
