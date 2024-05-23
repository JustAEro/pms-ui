import { attach, createEvent, createStore, sample } from 'effector';

import { fetchArchivedProjectsFx, Project } from '@pms-ui/entities/project';
import { $userType } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const pageMounted = createEvent();

export const searchValueChanged = createEvent<string>();

export const projectsPageButtonClicked = createEvent();

const fetchArchivedProjectsScopedFx = attach({
  effect: fetchArchivedProjectsFx,
});

const $archivedProjects = createStore<Project[]>([]);
export const $searchValue = createStore('');
export const $archivedProjectsToShow = createStore<Project[]>([]);

export const $areArchivedProjectsLoading =
  fetchArchivedProjectsScopedFx.pending;

export const headerModel = pageHeader.model.createModel({ $userType });

sample({
  clock: [
    pageMounted,
    routes.projectsRoute.opened,
    routes.projectsRoute.updated,
  ],
  source: $userType,
  filter: (userType) => userType === 'user',
  target: fetchArchivedProjectsScopedFx,
});

sample({
  clock: fetchArchivedProjectsScopedFx.doneData,
  target: [$archivedProjects, $archivedProjectsToShow] as const,
});

sample({
  clock: searchValueChanged,
  target: $searchValue,
});

sample({
  clock: searchValueChanged,
  source: $archivedProjects,
  fn: (projects, newSearchValue) =>
    projects.filter((project) =>
      project.name.toLowerCase().includes(newSearchValue.toLowerCase())
    ),
  target: $archivedProjectsToShow,
});

sample({
  clock: projectsPageButtonClicked,
  target: routes.projectsRoute.open,
});
