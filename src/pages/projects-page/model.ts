import { attach, createEvent, createStore, sample } from 'effector';

import { fetchProjectsFx, Project } from '@pms-ui/entities/project';
import { $userType } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const pageMounted = createEvent();
export const searchValueChanged = createEvent<string>();

const fetchProjectsScopedFx = attach({ effect: fetchProjectsFx });

const $projects = createStore<Project[]>([]);
export const $searchValue = createStore('');
export const $projectsToShow = createStore<Project[]>([]);

export const $areProjectsLoading = fetchProjectsScopedFx.pending;

export const headerModel = pageHeader.model.createModel({ $userType });

sample({
  clock: [
    pageMounted,
    routes.projectsRoute.opened,
    routes.projectsRoute.updated,
  ],
  source: $userType,
  filter: (userType) => userType === 'user',
  target: fetchProjectsScopedFx,
});

sample({
  clock: fetchProjectsScopedFx.doneData,
  target: [$projects, $projectsToShow] as const,
});

sample({
  clock: searchValueChanged,
  target: $searchValue,
});

sample({
  clock: searchValueChanged,
  source: $projects,
  fn: (projects, newSearchValue) =>
    projects.filter((project) =>
      project.name.toLowerCase().includes(newSearchValue.toLowerCase())
    ),
  target: $projectsToShow,
});
