/* eslint-disable jsx-a11y/anchor-is-valid */
import { useUnit } from 'effector-react';
import { FC, ReactNode, useEffect } from 'react';

import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { DisplayedOnBoardTaskStatus, TaskOnBoard } from '@pms-ui/entities/task';
import { header as pageHeader } from '@pms-ui/widgets/header';

import {
  $areTasksInProjectLoading,
  $draggedOverColumn,
  $dragStartedTaskStatus,
  $inProgressTasks,
  $isProjectLoading,
  $isTaskUpdateLoading,
  $openedTasks,
  $postponedTasks,
  $project,
  $reviewTasks,
  $testingTasks,
  dragEndedSuccess,
  dragEndResetCurrentTaskStatus,
  dragMovedOutOfColumns,
  dragOfTaskStarted,
  dragOverAcceptableColumnStarted,
  headerModel,
  pageMounted,
  taskCardLinkClicked,
} from './model';

const textFontSizes = [16, 21, 30];

export const ProjectPage: FC = () => {
  const isProjectLoading = useUnit($isProjectLoading);
  const project = useUnit($project);

  const areTasksInProjectLoading = useUnit($areTasksInProjectLoading);

  const onPageMount = useUnit(pageMounted);

  const isAdminOfProject = true;

  useEffect(() => {
    onPageMount();
  }, [onPageMount]);

  return (
    <Box>
      <pageHeader.ui model={headerModel} />
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        fontSize="3xl"
      >
        {isProjectLoading && <Spinner marginTop="30px" />}
        {!isProjectLoading && project && (
          <Flex
            marginTop="30px"
            direction="column"
            alignItems="center"
            gap="20px"
          >
            <Text fontWeight="bold" fontSize={textFontSizes}>
              Доска проекта {project.name}
            </Text>
            <Flex
              marginTop="30px"
              paddingLeft="50px"
              paddingRight="50px"
              width="100%"
              direction="row"
              justifyContent="space-between"
              gap={10}
            >
              <Button colorScheme="gray">Список задач проекта</Button>

              {isAdminOfProject && (
                <Button colorScheme="gray">Управление проектом</Button>
              )}

              <Button colorScheme="gray">Требования к проекту</Button>

              <Button colorScheme="gray">Архив задач</Button>
            </Flex>

            {!areTasksInProjectLoading && <ProjectBoard />}
            {areTasksInProjectLoading && <Spinner />}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

const ProjectBoard: FC = () => {
  const postponedTasks = useUnit($postponedTasks);
  const openedTasks = useUnit($openedTasks);
  const inProgressTasks = useUnit($inProgressTasks);
  const testingTasks = useUnit($testingTasks);
  const reviewTasks = useUnit($reviewTasks);

  const onDragTaskStart = useUnit(dragOfTaskStarted);

  const onDragEndResetCurrentTaskStatus = useUnit(
    dragEndResetCurrentTaskStatus
  );

  const dragStartedTaskStatus = useUnit($dragStartedTaskStatus);
  const draggedOverColumnStatus = useUnit($draggedOverColumn);

  const onDragMoveOutOfColumns = useUnit(dragMovedOutOfColumns);

  const onDragOverAcceptableColumnStart = useUnit(
    dragOverAcceptableColumnStarted
  );

  const onDragEndSuccess = useUnit(dragEndedSuccess);

  const onTaskLinkClick = useUnit(taskCardLinkClicked);

  const isTaskUpdateLoading = useUnit($isTaskUpdateLoading);

  const isDndDisabled = isTaskUpdateLoading;

  const mapStatusToTasks: Record<DisplayedOnBoardTaskStatus, TaskOnBoard[]> = {
    Отложено: postponedTasks,
    Открыт: openedTasks,
    'В работе': inProgressTasks,
    'На тестировании': testingTasks,
    'На ревью': reviewTasks,
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // active.id - id дрэгнутой задачи
    // active.data.current?.status - текущий статус дрэгнутой задачи

    onDragTaskStart({
      taskId: String(active.id),
      currentStatus: active.data.current!.status,
    });
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    if (
      !(
        over &&
        over.data.current &&
        (
          over.data.current.acceptsStatuses as DisplayedOnBoardTaskStatus[]
        ).includes(active.data.current?.status)
      )
    ) {
      // over.id - название нового статуса
      // active.data.current?.status -старый статус
      // active.id - id дрэгнутой задачи

      onDragMoveOutOfColumns();
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (
      over &&
      over.data.current &&
      (
        over.data.current.acceptsStatuses as DisplayedOnBoardTaskStatus[]
      ).includes(active.data.current?.status)
    ) {
      // over.id - название нового статуса
      // active.data.current?.status -старый статус
      // active.id - id дрэгнутой задачи

      onDragOverAcceptableColumnStart({
        columnStatus: over.id as DisplayedOnBoardTaskStatus,
      });
    }
  };

  const handleDragCancel = () => {
    onDragEndResetCurrentTaskStatus();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    onDragEndResetCurrentTaskStatus();

    const { active, over } = event;

    if (
      over &&
      over.data.current &&
      (
        over.data.current.acceptsStatuses as DisplayedOnBoardTaskStatus[]
      ).includes(active.data.current?.status)
    ) {
      // over.id - название нового статуса
      // active.data.current?.status -старый статус
      // active.id - id дрэгнутой задачи

      onDragEndSuccess({
        taskId: String(active.id),
        newStatus: over.id as DisplayedOnBoardTaskStatus,
      });
    }
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <HStack
        opacity={isTaskUpdateLoading ? 0.33 : 1}
        marginBottom="50px"
        spacing={8}
      >
        {columns.map((columnName) => (
          <Droppable
            disabled={isDndDisabled}
            key={columnName}
            id={columnName}
            acceptsStatuses={columnKeyAcceptsFromStatusesValue[columnName]}
          >
            <VStack
              outline={
                draggedOverColumnStatus === columnName
                  ? '2px solid black'
                  : undefined
              }
              opacity={columnOpacity({ dragStartedTaskStatus, columnName })}
              padding="20px 20px"
              minHeight="100vh"
              width="200px"
              bgColor="#EDF2F7"
              spacing={6}
            >
              <>
                <Flex
                  width="100%"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Text fontWeight="bold" fontSize="16px">
                    {columnName}
                  </Text>
                  <Text fontWeight="bold" fontSize="16px">
                    {mapStatusToTasks[columnName].length}
                  </Text>
                </Flex>

                {mapStatusToTasks[columnName].map((task) => (
                  <Draggable
                    key={task.id}
                    id={task.id}
                    disabled={isDndDisabled}
                    status={task.status}
                  >
                    <Box padding="10px 10px" width="160px" bgColor="#FFFFFF">
                      <Flex direction="row" justifyContent="space-between">
                        <Link>
                          <Text
                            onMouseDown={() => {
                              onTaskLinkClick({ taskId: task.id });
                            }}
                            cursor="pointer"
                            fontSize="20px"
                          >{`#${task.id}`}</Text>
                        </Link>
                      </Flex>
                      <Flex marginTop="20px">
                        <Text fontSize="20px" fontWeight="bold">
                          {task.name}
                        </Text>
                      </Flex>
                    </Box>
                  </Draggable>
                ))}
              </>
            </VStack>
          </Droppable>
        ))}
      </HStack>
    </DndContext>
  );
};

const Droppable: FC<{
  acceptsStatuses: DisplayedOnBoardTaskStatus[];
  id: DisplayedOnBoardTaskStatus;
  disabled: boolean | undefined;
  children: ReactNode;
}> = ({ id, acceptsStatuses, disabled, children }) => {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      acceptsStatuses,
    },
    disabled,
  });

  return <div ref={setNodeRef}>{children}</div>;
};

const Draggable: FC<{
  status: DisplayedOnBoardTaskStatus;
  id: string;
  disabled: boolean | undefined;
  children: ReactNode;
}> = ({ status, id, disabled, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      status,
    },
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

const columns: DisplayedOnBoardTaskStatus[] = [
  'Отложено',
  'Открыт',
  'В работе',
  'На тестировании',
  'На ревью',
];

const columnKeyAcceptsFromStatusesValue: Record<
  DisplayedOnBoardTaskStatus,
  DisplayedOnBoardTaskStatus[]
> = {
  Отложено: ['Открыт', 'В работе', 'На тестировании', 'На ревью'],
  Открыт: ['Отложено'],
  'В работе': ['Открыт', 'На ревью', 'На тестировании'],
  'На тестировании': ['В работе'],
  'На ревью': ['В работе', 'На тестировании'],
};

const statusKeyCanGoToColumnsValue: Record<
  DisplayedOnBoardTaskStatus,
  DisplayedOnBoardTaskStatus[]
> = {
  Отложено: ['Открыт'],
  Открыт: ['В работе', 'Отложено'],
  'В работе': ['Отложено', 'На тестировании', 'На ревью'],
  'На тестировании': ['Отложено', 'В работе', 'На ревью'],
  'На ревью': ['В работе', 'Отложено'],
};

const columnOpacity = ({
  dragStartedTaskStatus,
  columnName,
}: {
  dragStartedTaskStatus: DisplayedOnBoardTaskStatus | null;
  columnName: DisplayedOnBoardTaskStatus;
}) => {
  if (!dragStartedTaskStatus) {
    return 1;
  }

  if (
    statusKeyCanGoToColumnsValue[dragStartedTaskStatus].includes(columnName) ||
    columnName === dragStartedTaskStatus
  ) {
    return 1;
  }
  return 0.33;
};
