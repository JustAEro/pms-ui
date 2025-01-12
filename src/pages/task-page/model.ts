import { attach, createEvent, createStore, sample } from 'effector';

import {
  fetchTaskFx,
  generateTaskPlanByAIFx,
  Task,
  TaskStatus,
  updateTaskFx,
} from '@pms-ui/entities/task';
import {
  fetchTestScenariosOfTask,
  TestScenario,
} from '@pms-ui/entities/test-scenario';
import { $userType } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { errorToastModelFactory } from '@pms-ui/shared/ui';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const pageMounted = createEvent();
const reset = createEvent();

export const newStatusClicked = createEvent<{ newStatus: TaskStatus }>();

const closeTaskModalOpened = createEvent();
export const closeTaskModalClosed = createEvent();
export const closeTaskModalConfirmed = createEvent();

export const generateTaskPlanByAIButtonClicked = createEvent();

export const generateTaskPlanByAIScopedFx = attach({
  effect: generateTaskPlanByAIFx,
});
export const fetchTaskScopedFx = attach({ effect: fetchTaskFx });
export const fetchTestScenariosOfTaskScopedFx = attach({
  effect: fetchTestScenariosOfTask,
});
const updateTaskScopedFx = attach({ effect: updateTaskFx });

export const $task = createStore<Task | null>(null);

export const $taskPlan = createStore('');
export const $isTaskPlanLoading = generateTaskPlanByAIScopedFx.pending;

export const $isTaskLoading = fetchTaskScopedFx.pending;

export const $testScenarios = createStore<TestScenario[]>([]);
export const $isScenariosLoading = fetchTestScenariosOfTaskScopedFx.pending;

export const $isCloseTaskModalOpened = createStore(false);

const errorFetchTaskToastModel = errorToastModelFactory({
  triggerEvent: fetchTaskScopedFx.fail,
  notificationOptions: {
    status: 'error',
    duration: 9000,
    isClosable: true,
  },
});
export const { $notificationToShow, $notificationToastId } =
  errorFetchTaskToastModel.outputs;

export const headerModel = pageHeader.model.createModel({ $userType });

// sample({
//   clock: pageMounted,
//   source: $userType,
//   filter: (userType) => userType !== 'user',
//   target: routes.homeRoute.open,
// });

sample({
  clock: [pageMounted, routes.taskRoute.opened, routes.taskRoute.updated],
  source: { userType: $userType, pageParams: routes.taskRoute.$params },
  filter: ({ userType }) => userType === 'user',
  fn: ({ pageParams }) => ({ taskId: pageParams.taskId }),
  target: [fetchTaskScopedFx, fetchTestScenariosOfTaskScopedFx],
});

sample({
  clock: fetchTaskScopedFx.doneData,
  target: $task,
});

sample({
  clock: fetchTestScenariosOfTaskScopedFx.doneData,
  target: $testScenarios,
});

sample({
  clock: newStatusClicked,
  source: $task,
  filter: (task, { newStatus }): task is Task =>
    task !== null && newStatus !== 'Завершена',
  fn: (task: Task, { newStatus }) => {
    const updatedTask: Task = { ...task, status: newStatus };

    return updatedTask;
  },
  target: updateTaskScopedFx,
});

sample({
  clock: newStatusClicked,
  source: $task,
  filter: (task, { newStatus }): task is Task =>
    task !== null && newStatus === 'Завершена',
  target: closeTaskModalOpened,
});

sample({
  clock: updateTaskScopedFx.doneData,
  target: $task,
});

sample({
  clock: closeTaskModalOpened,
  source: $isCloseTaskModalOpened,
  fn: () => true,
  target: $isCloseTaskModalOpened,
});

sample({
  clock: closeTaskModalClosed,
  source: $isCloseTaskModalOpened,
  fn: () => false,
  target: $isCloseTaskModalOpened,
});

sample({
  clock: closeTaskModalConfirmed,
  source: $task,
  filter: (task): task is Task => task !== null,
  fn: (task: Task) => {
    const updatedTask: Task = { ...task, status: 'Завершена' };

    return updatedTask;
  },
  target: [updateTaskScopedFx, closeTaskModalClosed],
});

sample({
  clock: generateTaskPlanByAIButtonClicked,
  source: $task,
  filter: (task): task is Task => !!task,
  fn: (task) => ({
    taskId: task!.id,
    taskName: task!.name,
  }),
  target: generateTaskPlanByAIScopedFx,
});

sample({
  clock: generateTaskPlanByAIScopedFx.doneData,
  target: $taskPlan,
});

sample({
  clock: routes.taskRoute.closed,
  target: reset,
});

sample({
  clock: reset,
  target: [
    $task.reinit,
    $testScenarios.reinit,
    $isCloseTaskModalOpened.reinit,
    errorFetchTaskToastModel.inputs.reset,
    $taskPlan.reinit,
  ],
});
