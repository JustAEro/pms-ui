import { attach, createEvent, createStore, sample } from 'effector';

import { fetchClosedTasksFx, Task } from '@pms-ui/entities/task';
import { $userType } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const pageMounted = createEvent();

export const searchValueChanged = createEvent<string>();

export const projectPageButtonClicked = createEvent();

export const taskClicked = createEvent<{ taskId: string }>();

const fetchClosedTasksScopedFx = attach({
  effect: fetchClosedTasksFx,
});

const $closedTasks = createStore<Task[]>([]);
export const $searchValue = createStore('');
export const $closedTasksToShow = createStore<Task[]>([]);

export const $areClosedTasksLoading = fetchClosedTasksScopedFx.pending;

export const headerModel = pageHeader.model.createModel({ $userType });

// sample({
//   clock: pageMounted,
//   source: $userType,
//   filter: (userType) => userType !== 'user',
//   target: routes.homeRoute.open,
// });

sample({
  clock: [
    pageMounted,
    routes.closedTasksOfProjectRoute.opened,
    routes.closedTasksOfProjectRoute.updated,
  ],
  source: {
    userType: $userType,
    pageParams: routes.closedTasksOfProjectRoute.$params,
  },
  filter: ({ userType }) => userType === 'user',
  fn: ({ pageParams }) => ({
    projectId: pageParams.projectId,
  }),
  target: fetchClosedTasksScopedFx,
});

sample({
  clock: fetchClosedTasksScopedFx.doneData,
  target: [$closedTasks, $closedTasksToShow],
});

sample({
  clock: searchValueChanged,
  target: $searchValue,
});

sample({
  clock: searchValueChanged,
  source: $closedTasks,
  fn: (tasks, newSearchValue) =>
    tasks.filter((task) =>
      task.name.toLowerCase().includes(newSearchValue.toLowerCase())
    ),
  target: $closedTasksToShow,
});

sample({
  clock: projectPageButtonClicked,
  source: {
    pageParams: routes.closedTasksOfProjectRoute.$params,
  },
  fn: ({ pageParams }) => ({
    projectId: pageParams.projectId,
  }),
  target: routes.projectRoute.open,
});

sample({
  clock: taskClicked,
  target: routes.taskRoute.open,
});
