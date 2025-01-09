import { attach, createEvent, createStore, merge, sample } from 'effector';

import {
  CreateTask,
  CreateTaskDto,
  createTaskFx,
  fetchTaskFx,
  Task,
  UpdateTask,
  UpdateTaskDto,
  updateTaskMockFx,
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

const createTaskScopedFx = attach({ effect: createTaskFx });
const updateTaskScopedFx = attach({ effect: updateTaskMockFx });

export const $task = createStore<Task | null>(null);

export const $taskNameFieldValue = createStore('');
export const taskNameFieldValueChanged = createEvent<string>();

export const $taskDescriptionFieldValue = createStore('');
export const taskDescriptionFieldValueChanged = createEvent<string>();

export const $taskExecutorIdFieldValue = createStore('');
export const taskExecutorIdFieldValueChanged = createEvent<string>();

export const $taskTesterIdFieldValue = createStore('');
export const taskTesterIdFieldValueChanged = createEvent<string>();

export const $deadlineDateFieldValue = createStore<string>(''); // example of value (in MSK TZ): 2026-10-16T20:20:00.000
export const deadlineDateFieldValueChanged = createEvent<string>();

export const $files = createStore<File[] | null>(null);
export const filesChanged = createEvent<File[]>();

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
  fn: (task) => task.userExecutor.id,
  target: $taskExecutorIdFieldValue,
});

sample({
  clock: loadTaskFx.doneData,
  fn: (task) => task.userTester.id,
  target: $taskTesterIdFieldValue,
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
  clock: taskExecutorIdFieldValueChanged,
  target: $taskExecutorIdFieldValue,
});

sample({
  clock: taskTesterIdFieldValueChanged,
  target: $taskTesterIdFieldValue,
});

sample({
  clock: deadlineDateFieldValueChanged,
  target: $deadlineDateFieldValue,
});

sample({
  clock: filesChanged,
  target: $files,
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
    taskNameFieldValue: $taskNameFieldValue,
    taskDescriptionFieldValue: $taskDescriptionFieldValue,
    taskExecutorLoginFieldValue: $taskExecutorIdFieldValue,
    taskTesterLoginFieldValue: $taskTesterIdFieldValue,
    deadlineDateFieldValue: $deadlineDateFieldValue,
    paramsWithProjectId: routes.createTaskRoute.$params,
  },
  filter: ({ currentUser }) => !!currentUser,
  fn: ({
    currentUser,
    taskDescriptionFieldValue,
    taskExecutorLoginFieldValue,
    taskNameFieldValue,
    taskTesterLoginFieldValue,
    deadlineDateFieldValue,
    paramsWithProjectId,
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const createTask: CreateTaskDto = {
      author_id: currentUser!.id,
      deadline: `${deadlineDateFieldValue}000+03:00`,
      description: taskDescriptionFieldValue,
      executor_id: taskExecutorLoginFieldValue,
      name: taskNameFieldValue,
      project_id: paramsWithProjectId.projectId,
      status: 'Открыта',
      tester_id: taskTesterLoginFieldValue,
    }; // TODO: use dto after migrating to real API

    return {
      createTask,
    };
  },
  target: createTaskScopedFx,
});

sample({
  clock: editTaskStarted,
  source: {
    currentUser: $currentUser,
    jwtToken: $jwtToken,
    taskNameFieldValue: $taskNameFieldValue,
    taskDescriptionFieldValue: $taskDescriptionFieldValue,
    taskExecutorLoginFieldValue: $taskExecutorIdFieldValue,
    taskTesterLoginFieldValue: $taskTesterIdFieldValue,
    deadlineDateFieldValue: $deadlineDateFieldValue,
    paramsWithProjectId: routes.createTaskRoute.$params,
    task: $task,
  },
  filter: ({ currentUser, jwtToken, task }) =>
    !!currentUser && !!jwtToken && !!task,
  fn: ({
    currentUser,
    jwtToken,
    taskDescriptionFieldValue,
    taskExecutorLoginFieldValue,
    taskNameFieldValue,
    taskTesterLoginFieldValue,
    deadlineDateFieldValue,
    paramsWithProjectId,
    task,
  }) => {
    const updateTask: UpdateTask = {
      name: taskNameFieldValue,
      description: taskDescriptionFieldValue,
      userExecutorId: taskExecutorLoginFieldValue,
      userTesterId: taskTesterLoginFieldValue,
      deadlineDate: `${deadlineDateFieldValue}000+03:00`,
      project_id: paramsWithProjectId.projectId,
      status: task!.status,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dto: UpdateTaskDto = {
      author_id: currentUser!.id,
      deadline: `${deadlineDateFieldValue}000+03:00`,
      description: taskDescriptionFieldValue,
      executor_id: taskExecutorLoginFieldValue,
      name: taskNameFieldValue,
      project_id: paramsWithProjectId.projectId,
      status: task!.status,
      tester_id: taskTesterLoginFieldValue,
    }; // TODO: use dto after migrating to real API

    return {
      id: task!.id,
      updateTask,
      token: jwtToken!,
      currentUser: currentUser!,
    };
  },
  target: updateTaskScopedFx,
});

sample({
  clock: [createTaskScopedFx.doneData, updateTaskScopedFx.doneData],
  fn: (task) => ({ taskId: task.id }),
  target: routes.taskRoute.open,
});

const errorCreateTaskToastModel = errorToastModelFactory({
  triggerEvent: merge([createTaskScopedFx.fail, updateTaskScopedFx.fail]),
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
    $taskExecutorIdFieldValue.reinit,
    $taskTesterIdFieldValue.reinit,
    $pageMode.reinit,
  ] as const,
});
