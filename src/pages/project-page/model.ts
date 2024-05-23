import { attach, createEvent, createStore, sample } from 'effector';

import { fetchProjectFx, Project } from '@pms-ui/entities/project';
import { $userType } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const pageMounted = createEvent();

const fetchProjectScopedFx = attach({ effect: fetchProjectFx });

export const $project = createStore<Project | null>(null);

export const $isProjectLoading = fetchProjectScopedFx.pending;

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
