import { attach, combine, createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

import { fetchProjectsFx, Project } from '@pms-ui/entities/project';
import { $userType } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const pageMounted = createEvent();
export const searchValueChanged = createEvent<string>();

export const archivePageButtonClicked = createEvent();

export const projectClicked = createEvent<{ projectId: string }>();

export const createProjectModalOpened = createEvent();
export const createProjectModalClosed = createEvent();
export const createProjectButtonClicked = createEvent();
export const projectNameChanged = createEvent<string>();
export const projectDescriptionChanged = createEvent<string>();

const fetchProjectsScopedFx = attach({ effect: fetchProjectsFx });

const $projects = createStore<Project[]>([]);
export const $searchValue = createStore('');
export const $projectsToShow = createStore<Project[]>([]);

export const $projectName = createStore('');
export const $projectDescription = createStore('');

const $isCreateProjectButtonEnabled = combine(
  $projectName,
  (projectName) => projectName.length > 0
);
export const $isCreateProjectButtonDisabled = not(
  $isCreateProjectButtonEnabled
);

export const $areProjectsLoading = fetchProjectsScopedFx.pending;

export const $createProjectModalIsOpened = createStore(false);

export const headerModel = pageHeader.model.createModel({ $userType });

sample({
  clock: pageMounted,
  source: $userType,
  filter: (userType) => userType !== 'user',
  target: routes.homeRoute.open,
});

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

sample({
  clock: createProjectModalOpened,
  fn: () => true,
  target: $createProjectModalIsOpened,
});

sample({
  clock: createProjectModalClosed,
  fn: () => false,
  target: $createProjectModalIsOpened,
});

sample({
  clock: projectNameChanged,
  target: $projectName,
});

sample({
  clock: projectDescriptionChanged,
  target: $projectDescription,
});

sample({
  clock: createProjectModalClosed,
  target: [$projectName.reinit, $projectDescription.reinit],
});

sample({
  clock: archivePageButtonClicked,
  target: routes.archivedProjectsRoute.open,
});

sample({
  clock: projectClicked,
  target: routes.projectRoute.open,
});
