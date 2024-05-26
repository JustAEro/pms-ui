import { attach, createEvent, createStore, sample } from 'effector';

import { fetchTaskFx, Task } from '@pms-ui/entities/task';
import { $userType } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { errorToastModelFactory } from '@pms-ui/shared/ui';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const pageMounted = createEvent();

export const fetchTaskScopedFx = attach({ effect: fetchTaskFx });

export const $task = createStore<Task | null>(null);
export const $isTaskLoading = fetchTaskScopedFx.pending;

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
  target: fetchTaskScopedFx,
});

sample({
  clock: fetchTaskScopedFx.doneData,
  target: $task,
});
