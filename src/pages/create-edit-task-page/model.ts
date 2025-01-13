import {
  attach,
  createEvent,
  createStore,
  merge,
  sample,
  Store,
} from 'effector';

import { fetchUsersOfProjectFx } from '@pms-ui/entities/project';
import {
  CreateTaskDto,
  createTaskFx,
  fetchTaskFx,
  Task,
  UpdateTaskDto,
  updateTaskDtoFx,
} from '@pms-ui/entities/task';
import { $currentUser, $userType, User } from '@pms-ui/entities/user';
import { convertToMoscowTime, convertToUTC } from '@pms-ui/shared/lib';
import { controls, routes } from '@pms-ui/shared/routes';
import { errorToastModelFactory } from '@pms-ui/shared/ui';
import { header as pageHeader } from '@pms-ui/widgets/header';

import { UserOption } from './types';

type PageMode = 'create' | 'edit';

const reset = createEvent();

export const pageMounted = createEvent();
export const pageUnmounted = createEvent();

export const backToPreviousPageClicked = createEvent();

export const createOrEditTaskButtonClicked = createEvent();
const createTaskStarted = createEvent();
const editTaskStarted = createEvent();

export const executorMenuClicked = createEvent<{
  userId: string;
}>();

export const testerMenuClicked = createEvent<{
  userId: string;
}>();

const loadTaskFx = attach({ effect: fetchTaskFx });
export const $isTaskLoading = loadTaskFx.pending;

const createTaskScopedFx = attach({ effect: createTaskFx });
const updateTaskScopedFx = attach({ effect: updateTaskDtoFx });

const fetchMembersOfProjectScopedFx = attach({
  effect: fetchUsersOfProjectFx,
});

export const $membersOfProject = createStore<User[]>([]);

export const $activeUserExecutorOption = createStore<UserOption | null>(null);

export const $activeUserTesterOption = createStore<UserOption | null>(null);

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

export const $userOptions: Store<UserOption[]> = $membersOfProject.map(
  (members) =>
    members.map((member) => ({
      label: `${member.firstName} ${member.lastName} (${member.login})`,
      value: member.id,
      userId: member.id,
    }))
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

loadTaskFx.doneData.watch((payload) => console.log(JSON.stringify(payload)));
loadTaskFx.doneData.watch((payload) => console.log(payload));
loadTaskFx.doneData.watch((payload) =>
  console.log(payload.deadlineDate.toISOString())
);
loadTaskFx.doneData.watch((payload) =>
  console.log(payload.deadlineDate.toString())
);

sample({
  clock: loadTaskFx.doneData,
  target: $task,
});

sample({
  clock: loadTaskFx.doneData,
  fn: (task) => ({ projectId: task.project_id }),
  target: fetchMembersOfProjectScopedFx,
});

sample({
  clock: pageMounted,
  source: routes.createTaskRoute.$params,
  filter: () => window.location.href.includes('create'),
  fn: (params) => ({ projectId: params.projectId }),
  target: fetchMembersOfProjectScopedFx,
});

sample({
  clock: fetchMembersOfProjectScopedFx.doneData,
  target: $membersOfProject,
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
  fn: (task) => {
    const optionToBeActive: UserOption = {
      label: `${task.userExecutor.firstName} ${task.userExecutor.lastName} (${task.userExecutor.login})`,
      value: task.userExecutor.id,
      userId: task.userExecutor.id,
    };

    return optionToBeActive;
  },
  target: $activeUserExecutorOption,
});

sample({
  clock: loadTaskFx.doneData,
  fn: (task) => {
    const optionToBeActive: UserOption = {
      label: `${task.userTester.firstName} ${task.userTester.lastName} (${task.userTester.login})`,
      value: task.userTester.id,
      userId: task.userTester.id,
    };

    return optionToBeActive;
  },
  target: $activeUserTesterOption,
});

sample({
  clock: loadTaskFx.doneData,
  fn: (task) => task.userTester.id,
  target: $taskTesterIdFieldValue,
});

sample({
  clock: loadTaskFx.doneData,
  fn: (task) => convertToMoscowTime(task.deadlineDate).replace('+03:00', ''),
  target: $deadlineDateFieldValue,
});
$deadlineDateFieldValue.watch(console.log);
sample({
  clock: backToPreviousPageClicked,
  target: controls.back,
});

sample({
  clock: executorMenuClicked,
  fn: ({ userId }) => userId,
  target: $taskExecutorIdFieldValue,
});

sample({
  clock: executorMenuClicked,
  source: $userOptions,
  fn: (options, { userId }) => {
    const option = options.find((option) => option.userId === userId);

    const optionToBeActive: UserOption = {
      label: option?.label ?? '',
      value: option?.value ?? '',
      userId: option?.userId ?? '',
    };

    return optionToBeActive;
  },
  target: $activeUserExecutorOption,
});

sample({
  clock: testerMenuClicked,
  fn: ({ userId }) => userId,
  target: $taskTesterIdFieldValue,
});

sample({
  clock: testerMenuClicked,
  source: $userOptions,
  fn: (options, { userId }) => {
    const option = options.find((option) => option.userId === userId);

    const optionToBeActive: UserOption = {
      label: option?.label ?? '',
      value: option?.value ?? '',
      userId: option?.userId ?? '',
    };

    return optionToBeActive;
  },
  target: $activeUserTesterOption,
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
      deadline: `${deadlineDateFieldValue}+03:00`,
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
    taskNameFieldValue: $taskNameFieldValue,
    taskDescriptionFieldValue: $taskDescriptionFieldValue,
    taskExecutorIdFieldValue: $taskExecutorIdFieldValue,
    taskTesterIdFieldValue: $taskTesterIdFieldValue,
    deadlineDateFieldValue: $deadlineDateFieldValue,
    task: $task,
  },
  filter: ({ currentUser, task }) => !!currentUser && !!task,
  fn: ({
    currentUser,
    taskDescriptionFieldValue,
    taskExecutorIdFieldValue,
    taskNameFieldValue,
    taskTesterIdFieldValue,
    deadlineDateFieldValue,
    task,
  }) => {
    const dto: UpdateTaskDto = {
      author_id: currentUser!.id,
      deadline: convertToUTC(`${deadlineDateFieldValue}+03:00`),
      description: taskDescriptionFieldValue,
      executor_id: taskExecutorIdFieldValue,
      name: taskNameFieldValue,
      project_id: task!.project_id,
      status: task!.status,
      tester_id: taskTesterIdFieldValue,
    };

    return {
      dto,
      taskId: task!.id,
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
    $membersOfProject.reinit,
    $activeUserExecutorOption.reinit,
    $activeUserTesterOption.reinit,
  ] as const,
});
