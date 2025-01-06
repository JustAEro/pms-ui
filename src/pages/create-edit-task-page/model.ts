import { attach, createEvent, createStore, sample } from 'effector';

import {
  CreateTask,
  CreateTaskDto,
  createTaskMockFx,
  fetchTaskFx,
  Task,
} from '@pms-ui/entities/task';
import { $currentUser, $jwtToken, $userType } from '@pms-ui/entities/user';
import { controls, routes } from '@pms-ui/shared/routes';
import { errorToastModelFactory } from '@pms-ui/shared/ui';
import { header as pageHeader } from '@pms-ui/widgets/header';

type PageMode = 'create' | 'edit';

const reset = createEvent();

export const pageMounted = createEvent();
export const pageUnmounted = createEvent();

export const backToPreviousPageClicked = createEvent();

export const createOrEditTaskButtonClicked = createEvent();
const createTaskStarted = createEvent();
const editTaskStarted = createEvent();

const loadTaskFx = attach({ effect: fetchTaskFx });
export const $isTaskLoading = loadTaskFx.pending;

const createTaskScopedFx = attach({ effect: createTaskMockFx });

export const $task = createStore<Task | null>(null);

export const $taskNameFieldValue = createStore('');
export const taskNameFieldValueChanged = createEvent<string>();

export const $taskDescriptionFieldValue = createStore('');
export const taskDescriptionFieldValueChanged = createEvent<string>();

export const $taskExecutorLoginFieldValue = createStore('');
export const taskExecutorLoginFieldValueChanged = createEvent<string>();

export const $taskTesterLoginFieldValue = createStore('');
export const taskTesterLoginFieldValueChanged = createEvent<string>();

export const $deadlineDateFieldValue = createStore<string>(''); // example of value (in MSK TZ): 2026-10-16T20:20:00.000
export const deadlineDateFieldValueChanged = createEvent<string>();

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
  clock: deadlineDateFieldValueChanged,
  target: $deadlineDateFieldValue,
});

sample({
  clock: createOrEditTaskButtonClicked,
  source: $pageMode,
  filter: (pageMode) => pageMode === 'create',
  target: createTaskStarted,
});

sample({
  clock: createOrEditTaskButtonClicked,
  source: $pageMode,
  filter: (pageMode) => pageMode === 'edit',
  target: editTaskStarted,
});

sample({
  clock: createTaskStarted,
  source: {
    currentUser: $currentUser,
    jwtToken: $jwtToken,
    taskNameFieldValue: $taskNameFieldValue,
    taskDescriptionFieldValue: $taskDescriptionFieldValue,
    taskExecutorLoginFieldValue: $taskExecutorLoginFieldValue,
    taskTesterLoginFieldValue: $taskTesterLoginFieldValue,
    deadlineDateFieldValue: $deadlineDateFieldValue,
    paramsWithProjectId: routes.createTaskRoute.$params,
  },
  filter: ({ currentUser, jwtToken }) => !!currentUser && !!jwtToken,
  fn: ({
    currentUser,
    jwtToken,
    taskDescriptionFieldValue,
    taskExecutorLoginFieldValue,
    taskNameFieldValue,
    taskTesterLoginFieldValue,
    deadlineDateFieldValue,
    paramsWithProjectId,
  }) => {
    const createTask: CreateTask = {
      name: taskNameFieldValue,
      description: taskDescriptionFieldValue,
      userExecutorId: taskExecutorLoginFieldValue,
      userTesterId: taskTesterLoginFieldValue,
      deadlineDate: `${deadlineDateFieldValue}000+03:00`,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dto: CreateTaskDto = {
      author_id: currentUser!.id,
      deadline: deadlineDateFieldValue,
      description: taskDescriptionFieldValue,
      executor_id: taskExecutorLoginFieldValue,
      name: taskNameFieldValue,
      project_id: paramsWithProjectId.projectId,
      status: 'Открыта',
      tester_id: taskTesterLoginFieldValue,
    }; // TODO: use dto after migrating to real API

    return {
      createTask,
      token: jwtToken!,
      currentUser: currentUser!,
    };
  },
  target: createTaskScopedFx,
});

sample({
  clock: createTaskScopedFx.doneData,
  fn: (task) => ({ taskId: task.id }),
  target: routes.taskRoute.open,
});

const errorCreateTaskToastModel = errorToastModelFactory({
  triggerEvent: createTaskScopedFx.fail,
  notificationOptions: {
    status: 'error',
    duration: 9000,
    isClosable: true,
  },
});

export const { $notificationToShow, $notificationToastId } =
  errorCreateTaskToastModel.outputs;

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
