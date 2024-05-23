import { attach, createEvent, createStore, sample } from 'effector';

import { fetchProjectFx, Project } from '@pms-ui/entities/project';
import {
  DisplayedOnBoardTaskStatus,
  fetchTasksInProjectFx,
  TaskOnBoard,
  updateTaskFx,
} from '@pms-ui/entities/task';
import { $userType } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const pageMounted = createEvent();

export const dragOfTaskStarted = createEvent<{
  taskId: string;
  currentStatus: DisplayedOnBoardTaskStatus;
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

const $tasksInProjectOnBoard = createStore<TaskOnBoard[]>([]);
export const $postponedTasks = $tasksInProjectOnBoard.map((tasks) =>
  tasks.filter((task) => task.status === 'Отложено')
);
export const $openedTasks = $tasksInProjectOnBoard.map((tasks) =>
  tasks.filter((task) => task.status === 'Открыт')
);
export const $inProgressTasks = $tasksInProjectOnBoard.map((tasks) =>
  tasks.filter((task) => task.status === 'В работе')
);
export const $testingTasks = $tasksInProjectOnBoard.map((tasks) =>
  tasks.filter((task) => task.status === 'На тестировании')
);
export const $reviewTasks = $tasksInProjectOnBoard.map((tasks) =>
  tasks.filter((task) => task.status === 'На ревью')
);

export const $project = createStore<Project | null>(null);

export const $dragStartedTaskStatus =
  createStore<DisplayedOnBoardTaskStatus | null>(null);

export const $isProjectLoading = fetchProjectScopedFx.pending;

export const $areTasksInProjectLoading = fetchTasksInProjectScopedFx.pending;

export const headerModel = pageHeader.model.createModel({ $userType });

sample({
  clock: [pageMounted, routes.projectRoute.opened, routes.projectRoute.updated],
  source: { userType: $userType, pageParams: routes.projectRoute.$params },
  filter: ({ userType }) => userType === 'user',
  fn: ({ pageParams }) => pageParams.projectId,
  target: fetchProjectScopedFx,
});

sample({
  clock: fetchProjectScopedFx.doneData,
  target: $project,
});

sample({
  clock: fetchProjectScopedFx.done,
  fn: ({ params }) => ({ projectId: params }),
  target: fetchTasksInProjectScopedFx,
});

sample({
  clock: fetchTasksInProjectScopedFx.doneData,
  target: $tasksInProjectOnBoard,
});

sample({
  clock: dragOfTaskStarted,
  fn: (params) => params.currentStatus,
  target: $dragStartedTaskStatus,
});

sample({
  clock: dragEndResetCurrentTaskStatus,
  target: $dragStartedTaskStatus.reinit,
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
  source: $project,
  filter: (project): project is Project => !!project,
  fn: (project) => ({
    projectId: project!.id,
  }),
  target: fetchTasksInProjectScopedFx,
});
