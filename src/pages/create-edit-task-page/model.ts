import { attach, createEvent, createStore, sample } from 'effector';

import { fetchTaskFx, Task } from '@pms-ui/entities/task';
import { $userType } from '@pms-ui/entities/user';
import { controls, routes } from '@pms-ui/shared/routes';
import { header as pageHeader } from '@pms-ui/widgets/header';

type PageMode = 'create' | 'edit';

const reset = createEvent();

export const pageMounted = createEvent();
export const pageUnmounted = createEvent();

export const backToPreviousPageClicked = createEvent();

const loadTaskFx = attach({ effect: fetchTaskFx });
export const $isTaskLoading = loadTaskFx.pending;

export const $task = createStore<Task | null>(null);

export const $taskNameFieldValue = createStore('');
export const taskNameFieldValueChanged = createEvent<string>();

export const $taskDescriptionFieldValue = createStore('');
export const taskDescriptionFieldValueChanged = createEvent<string>();

export const $taskExecutorLoginFieldValue = createStore('');
export const taskExecutorLoginFieldValueChanged = createEvent<string>();

export const $taskTesterLoginFieldValue = createStore('');
export const taskTesterLoginFieldValueChanged = createEvent<string>();

export const $pageMode = createStore<PageMode>(
  window.location.href.includes('create') ? 'create' : 'edit'
);

export const headerModel = pageHeader.model.createModel({ $userType });

sample({
  clock: pageMounted,
  filter: () => window.location.href.includes('edit'),
  fn: () => 'edit' as const,
  target: $pageMode,
});

sample({
  clock: pageMounted,
  filter: () => window.location.href.includes('create'),
  fn: () => 'create' as const,
  target: $pageMode,
});

sample({
  clock: [routes.createTaskRoute.opened, routes.createTaskRoute.updated],
  fn: () => 'create' as const,
  target: $pageMode,
});

sample({
  clock: [routes.editTaskRoute.opened, routes.editTaskRoute.updated],
  fn: () => 'edit' as const,
  target: $pageMode,
});

sample({
  clock: [routes.editTaskRoute.opened, routes.editTaskRoute.updated],
  fn: ({ params }) => ({ taskId: params.taskId }),
  target: loadTaskFx,
});

sample({
  clock: pageMounted,
  source: routes.editTaskRoute.$params,
  filter: () => window.location.href.includes('edit'),
  target: loadTaskFx,
});

sample({
  clock: loadTaskFx.doneData,
  target: $task,
});

sample({
  clock: loadTaskFx.doneData,
  fn: (task) => task.name,
  target: $taskNameFieldValue,
});

sample({
  clock: loadTaskFx.doneData,
  fn: (task) => task.description,
  target: $taskDescriptionFieldValue,
});

sample({
  clock: loadTaskFx.doneData,
  fn: (task) => task.userExecutor.login,
  target: $taskExecutorLoginFieldValue,
});

sample({
  clock: loadTaskFx.doneData,
  fn: (task) => task.userTester.login,
  target: $taskTesterLoginFieldValue,
});

sample({
  clock: backToPreviousPageClicked,
  target: controls.back,
});

sample({
  clock: taskNameFieldValueChanged,
  target: $taskNameFieldValue,
});

sample({
  clock: taskDescriptionFieldValueChanged,
  target: $taskDescriptionFieldValue,
});

sample({
  clock: taskExecutorLoginFieldValueChanged,
  target: $taskExecutorLoginFieldValue,
});

sample({
  clock: taskTesterLoginFieldValueChanged,
  target: $taskTesterLoginFieldValue,
});

sample({
  clock: [
    pageUnmounted,
    routes.editTaskRoute.closed,
    routes.createTaskRoute.closed,
  ],
  target: reset,
});

sample({
  clock: reset,
  target: [
    $task.reinit,
    $taskNameFieldValue.reinit,
    $taskDescriptionFieldValue.reinit,
    $taskExecutorLoginFieldValue.reinit,
    $taskTesterLoginFieldValue.reinit,
    $pageMode.reinit,
  ] as const,
});
