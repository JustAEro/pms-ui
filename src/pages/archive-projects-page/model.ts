import { attach, combine, createEvent, createStore, sample } from 'effector';

import { fetchProjectsFx, Project } from '@pms-ui/entities/project';
import { $userType, $userId } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const pageMounted = createEvent();

export const searchValueChanged = createEvent<string>();

export const projectsPageButtonClicked = createEvent();

export const projectClicked = createEvent<{ projectId: string }>();

const fetchArchivedProjectsScopedFx = attach({
  effect: fetchProjectsFx,
});

const $archivedProjects = createStore<Project[]>([]);
export const $searchValue = createStore('');
export const $archivedProjectsToShow = createStore<Project[]>([]);

export const $areArchivedProjectsLoading =
  fetchArchivedProjectsScopedFx.pending;

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
  ],
  source: combine({
    userType: $userType,
    userId: $userId,
  }),
  filter: ({ userId, userType }) => !!userId && userType === 'user',
  fn: ({ userId }) => {
    if (!userId) {
      throw new Error('userId is null');
    }
    return { userId };
  },
  target: fetchArchivedProjectsScopedFx,
});

sample({
  clock: fetchArchivedProjectsScopedFx.doneData,
  fn: (data: Project[]) =>
    data.filter((project) => project.is_active === false),
  target: [$archivedProjects, $archivedProjectsToShow],
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

sample({
  clock: projectClicked,
  target: routes.projectRoute.open,
});
