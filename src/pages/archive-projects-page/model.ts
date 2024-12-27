import { attach, createEvent, createStore, sample, combine } from 'effector';

import { fetchArchivedProjectsFx, Project } from '@pms-ui/entities/project';
import { $userType } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const pageMounted = createEvent();

export const searchValueChanged = createEvent<string>();

export const projectsPageButtonClicked = createEvent();

export const projectClicked = createEvent<{ projectId: string }>();

const fetchArchivedProjectsScopedFx = attach({
  effect: fetchArchivedProjectsFx,
});
export const pageNumberChanged = createEvent<number>();
export const pageSizeChanged = createEvent<number>();
export const nextPageClicked = createEvent();
export const prevPageClicked = createEvent();

const $archivedProjects = createStore<Project[]>([]);
export const $searchValue = createStore('');
export const $archivedProjectsToShow = createStore<Project[]>([]);

export const $areArchivedProjectsLoading =
  fetchArchivedProjectsScopedFx.pending;

export const headerModel = pageHeader.model.createModel({ $userType });
export const $currentPage = createStore(1);
export const $pageSize = createStore(10);
export const $totalProjects = createStore(0);
export const $totalPages = combine(
  $totalProjects,
  $pageSize,
  (totalProjects, pageSize) => Math.ceil(totalProjects / pageSize)
);
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
  target: fetchArchivedProjectsScopedFx,
});

sample({
  clock: fetchArchivedProjectsScopedFx.doneData,
  fn: (data) => data.items,
  target: [$archivedProjects, $archivedProjectsToShow],
});

sample({
  clock: fetchArchivedProjectsScopedFx.doneData,
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
  source: $archivedProjects,
  fn: (projects, newSearchValue) =>
    projects.filter((project) =>
      project.name.toLowerCase().includes(newSearchValue.toLowerCase())
    ),
  target: $archivedProjectsToShow,
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
  target: [$currentPage, pageNumberChanged],
});

sample({
  clock: prevPageClicked,
  source: $currentPage,
  filter: (currentPage) => currentPage > 1,
  fn: (currentPage) => currentPage - 1,
  target: [$currentPage, pageNumberChanged],
});

sample({
  clock: projectsPageButtonClicked,
  target: routes.projectsRoute.open,
});

sample({
  clock: projectClicked,
  target: routes.projectRoute.open,
});
