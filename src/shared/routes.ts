import { createHistoryRouter, createRoute } from 'atomic-router';
import { createBrowserHistory, createMemoryHistory } from 'history';

import { featureToggles } from './feature-toggles';

export const routes = {
  homeRoute: createRoute(),
  usersAdminPanelRoute: createRoute(),
  adminsPanelRoute: createRoute(),
  profileRoute: createRoute(),
  userEditRoute: createRoute<{ userId: string }>(),
  projectsRoute: createRoute(),
  archivedProjectsRoute: createRoute(),
  projectRoute: createRoute<{ projectId: string }>(),
};

const routeObjects = [
  { path: '/', route: routes.homeRoute },
  { path: '/users-admin-panel', route: routes.usersAdminPanelRoute },
  { path: '/admin-panel', route: routes.adminsPanelRoute },
  { path: '/profile', route: routes.profileRoute },
  { path: '/users-admin-panel/user/:userId/edit', route: routes.userEditRoute },
  { path: '/projects', route: routes.projectsRoute },
  { path: '/projects/archive', route: routes.archivedProjectsRoute },
  { path: '/project/:projectId', route: routes.projectRoute },
];

export const router = createHistoryRouter({ routes: routeObjects });

const history = featureToggles.isSsr
  ? createMemoryHistory()
  : createBrowserHistory();

router.setHistory(history);
