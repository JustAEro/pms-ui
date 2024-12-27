import { redirect } from 'atomic-router';
import { attach, combine, createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

import {
  CreateProject,
  createProjectFx,
  fetchProjectsFx,
  Project,
} from '@pms-ui/entities/project';
import { $userType } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const pageMounted = createEvent();
export const pageUnmounted = createEvent();
const reset = createEvent();
export const searchValueChanged = createEvent<string>();

export const archivePageButtonClicked = createEvent();

export const projectClicked = createEvent<{ projectId: string }>();

export const createProjectModalOpened = createEvent();
export const createProjectModalClosed = createEvent();
export const createProjectButtonClicked = createEvent();
export const projectNameChanged = createEvent<string>();
export const projectDescriptionChanged = createEvent<string>();

export const pageNumberChanged = createEvent<number>();
export const pageSizeChanged = createEvent<number>();
export const nextPageClicked = createEvent();
export const prevPageClicked = createEvent();

const fetchProjectsScopedFx = attach({ effect: fetchProjectsFx });
const createProjectScopedFx = attach({ effect: createProjectFx });

const $projects = createStore<Project[]>([]);
export const $searchValue = createStore('');
export const $projectsToShow = createStore<Project[]>([]);

export const $projectName = createStore('');
export const $projectDescription = createStore('');

export const $currentPage = createStore(1);
export const $pageSize = createStore(10);
export const $totalProjects = createStore(0);
export const $totalPages = combine(
  $totalProjects,
  $pageSize,
  (totalProjects, pageSize) => Math.ceil(totalProjects / pageSize)
);

const $isCreateProjectButtonEnabled = combine(
  $projectName,
  (projectName) => projectName.length > 0
);
export const $isCreateProjectButtonDisabled = not(
  $isCreateProjectButtonEnabled
);

export const $areProjectsLoading = fetchProjectsScopedFx.pending;
export const $isProjectCreationFormDisabledBecauseCreationPending =
  createProjectScopedFx.pending;

export const $createProjectModalIsOpened = createStore(false);

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
    routes.projectsRoute.opened,
    routes.projectsRoute.updated,
    pageNumberChanged,
    pageSizeChanged,
  ],
  source: combine({
    userType: $userType,
    currentPage: $currentPage,
    pageSize: $pageSize,
  }),
  filter: ({ userType }) => userType === 'user',
  fn: ({ currentPage, pageSize }) => ({
    pageIndex: currentPage,
    pageSize,
  }),
  target: fetchProjectsScopedFx,
});

sample({
  clock: fetchProjectsScopedFx.doneData,
  fn: (data) => data.items,
  target: [$projects, $projectsToShow],
});

sample({
  clock: fetchProjectsScopedFx.doneData,
  fn: (data) => data.total,
  target: $totalProjects,
});
sample({
  clock: pageNumberChanged,
  target: $currentPage,
});

sample({
  clock: pageSizeChanged,
  target: $pageSize,
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
  filter: not($isProjectCreationFormDisabledBecauseCreationPending),
  fn: () => false,
  target: [
    $createProjectModalIsOpened,
    $projectName.reinit,
    $projectDescription.reinit,
  ],
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
  clock: archivePageButtonClicked,
  target: routes.archivedProjectsRoute.open,
});

sample({
  clock: projectClicked,
  target: routes.projectRoute.open,
});

sample({
  clock: createProjectButtonClicked,
  source: {
    projectName: $projectName,
    projectDescription: $projectDescription,
  },
  fn: ({ projectName, projectDescription }): CreateProject => ({
    name: projectName,
    description: projectDescription,
    isArchived: false,
  }),
  target: createProjectScopedFx,
});

sample({
  clock: nextPageClicked,
  source: combine({
    currentPage: $currentPage,
    totalProjects: $totalProjects,
    pageSize: $pageSize,
  }),
  filter: ({ currentPage, totalProjects, pageSize }) =>
    currentPage < Math.ceil(totalProjects / pageSize),
  fn: ({ currentPage }) => currentPage + 1,
  target: $currentPage,
});

sample({
  clock: prevPageClicked,
  source: $currentPage,
  filter: (currentPage) => currentPage > 1,
  fn: (currentPage) => currentPage - 1,
  target: $currentPage,
});

redirect({
  clock: createProjectScopedFx.doneData,
  params: ({ id }) => ({ projectId: id }),
  route: routes.projectRoute,
});

sample({
  clock: pageUnmounted,
  target: reset,
});

sample({
  clock: reset,
  target: [
    $projects.reinit,
    $projectsToShow.reinit,
    $searchValue.reinit,
    $projectName.reinit,
    $projectDescription.reinit,
    $createProjectModalIsOpened.reinit,
  ] as const,
});
