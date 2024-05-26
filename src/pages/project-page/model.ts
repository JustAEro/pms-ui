import { attach, createEvent, createStore, sample } from 'effector';

import { fetchProjectFx, Project } from '@pms-ui/entities/project';
import {
  DisplayedOnBoardTaskStatus,
  fetchTasksInProjectFx,
  NotShownOnBoardStatuses,
  Task,
  TaskOnBoard,
  taskStatusesNotShownOnBoard,
  updateTaskFx,
} from '@pms-ui/entities/task';
import { $userType } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { errorToastModelFactory } from '@pms-ui/shared/ui';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const pageMounted = createEvent();
export const pageUnmounted = createEvent();

const reset = createEvent();

export const dragOfTaskStarted = createEvent<{
  taskId: string;
  currentStatus: DisplayedOnBoardTaskStatus;
}>();
export const dragMovedOutOfColumns = createEvent();
export const dragOverAcceptableColumnStarted = createEvent<{
  columnStatus: DisplayedOnBoardTaskStatus;
}>();
export const dragEndResetCurrentTaskStatus = createEvent();
export const dragEndedSuccess = createEvent<{
  taskId: string;
  newStatus: DisplayedOnBoardTaskStatus;
}>();

export const taskCardLinkClicked = createEvent<{ taskId: string }>();

const fetchProjectScopedFx = attach({ effect: fetchProjectFx });

const fetchTasksInProjectScopedFx = attach({ effect: fetchTasksInProjectFx });

const updateTaskScopedFx = attach({ effect: updateTaskFx });

const $tasksInProject = createStore<Task[]>([]);
export const $tasksTotalCount = $tasksInProject.map((tasks) => tasks.length);
export const $tasksArchivedCount = $tasksInProject.map(
  (tasks) => tasks.filter((task) => task.status === 'Архив').length
);
export const $tasksExpiredCount = $tasksInProject.map(
  (tasks) => tasks.filter((task) => task.deadlineDate < new Date()).length
);

const $tasksInProjectOnBoard = $tasksInProject.map((tasks) =>
  tasks.filter(
    (task) =>
      !taskStatusesNotShownOnBoard.includes(
        task.status as NotShownOnBoardStatuses
      )
  )
);
export const $postponedTasks = $tasksInProjectOnBoard.map((tasks) =>
  tasks.filter<TaskOnBoard>(
    (task): task is TaskOnBoard => task.status === 'Отложено'
  )
);
export const $openedTasks = $tasksInProjectOnBoard.map((tasks) =>
  tasks.filter<TaskOnBoard>(
    (task): task is TaskOnBoard => task.status === 'Открыт'
  )
);
export const $inProgressTasks = $tasksInProjectOnBoard.map((tasks) =>
  tasks.filter<TaskOnBoard>(
    (task): task is TaskOnBoard => task.status === 'В работе'
  )
);
export const $testingTasks = $tasksInProjectOnBoard.map((tasks) =>
  tasks.filter<TaskOnBoard>(
    (task): task is TaskOnBoard => task.status === 'На тестировании'
  )
);
export const $reviewTasks = $tasksInProjectOnBoard.map((tasks) =>
  tasks.filter<TaskOnBoard>(
    (task): task is TaskOnBoard => task.status === 'На ревью'
  )
);

export const $project = createStore<Project | null>(null);

export const $dragStartedTaskStatus =
  createStore<DisplayedOnBoardTaskStatus | null>(null);

export const $draggedOverColumn =
  createStore<DisplayedOnBoardTaskStatus | null>(null);

export const $isProjectLoading = fetchProjectScopedFx.pending;

export const $areTasksInProjectLoading = fetchTasksInProjectScopedFx.pending;

export const $isTaskUpdateLoading = updateTaskScopedFx.pending;

export const headerModel = pageHeader.model.createModel({ $userType });

const errorToastModel = errorToastModelFactory({
  triggerEvent: fetchProjectScopedFx.fail,
});

export const {
  $notificationToShow: $projectNotification,
  $notificationToastId: $projectToastId,
} = errorToastModel.outputs;

// sample({
//   clock: pageMounted,
//   source: $userType,
//   filter: (userType) => userType !== 'user',
//   target: routes.homeRoute.open,
// });

sample({
  clock: [pageMounted, routes.projectRoute.opened, routes.projectRoute.updated],
  source: { userType: $userType, pageParams: routes.projectRoute.$params },
  filter: ({ userType }) => userType === 'user',
  fn: ({ pageParams }) => ({ projectId: pageParams.projectId }),
  target: fetchProjectScopedFx,
});

sample({
  clock: fetchProjectScopedFx.doneData,
  target: $project,
});

sample({
  clock: fetchProjectScopedFx.done,
  fn: ({ params }) => ({ projectId: params.projectId }),
  target: fetchTasksInProjectScopedFx,
});

sample({
  clock: fetchTasksInProjectScopedFx.doneData,
  target: $tasksInProject,
});

sample({
  clock: dragOfTaskStarted,
  fn: (params) => params.currentStatus,
  target: $dragStartedTaskStatus,
});

sample({
  clock: dragEndResetCurrentTaskStatus,
  target: [$dragStartedTaskStatus.reinit, $draggedOverColumn.reinit] as const,
});

sample({
  clock: dragEndedSuccess,
  source: $tasksInProjectOnBoard,
  filter: (tasks, eventPayload) =>
    tasks.find((task) => task.id === eventPayload.taskId) !== undefined,
  fn: (tasks, eventPayload) => ({
    ...tasks.find((task) => task.id === eventPayload.taskId)!,
    status: eventPayload.newStatus,
  }),
  target: updateTaskScopedFx,
});

sample({
  clock: updateTaskScopedFx.doneData,
  source: $tasksInProject,
  fn: (tasks, updatedTask) =>
    [updatedTask, ...tasks.filter((task) => task.id !== updatedTask.id)].sort(
      (a, b) => a.id.localeCompare(b.id)
    ),
  target: $tasksInProject,
});

// sample({
//   clock: updateTaskScopedFx.doneData,
//   source: $project,
//   filter: (project): project is Project => !!project,
//   fn: (project) => ({
//     projectId: project!.id,
//   }),
//   target: fetchTasksInProjectScopedFx,
// });

sample({
  clock: dragOverAcceptableColumnStarted,
  fn: (payload) => payload.columnStatus,
  target: $draggedOverColumn,
});

sample({
  clock: dragMovedOutOfColumns,
  target: $draggedOverColumn.reinit,
});

sample({
  clock: taskCardLinkClicked,
  target: routes.taskRoute.open,
});

sample({
  clock: [pageUnmounted, routes.projectRoute.closed],
  target: reset,
});

sample({
  clock: reset,
  target: [
    $dragStartedTaskStatus.reinit,
    $draggedOverColumn.reinit,
    $project.reinit,
    errorToastModel.inputs.reset,
  ] as const,
});
