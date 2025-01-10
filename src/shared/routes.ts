import {
  createHistoryRouter,
  createRoute,
  createRouterControls,
} from 'atomic-router';
import { createBrowserHistory, createMemoryHistory } from 'history';

import { featureToggles } from './feature-toggles';

export const controls = createRouterControls();

export const routes = {
  homeRoute: createRoute(),
  usersAdminPanelRoute: createRoute(),
  adminsPanelRoute: createRoute(),
  profileRoute: createRoute(),
  userEditRoute: createRoute<{ userId: string }>(),
  projectsRoute: createRoute(),
  archivedProjectsRoute: createRoute(),
  projectRoute: createRoute<{ projectId: string }>(),
  projectManagementRoute: createRoute<{ projectId: string }>(),
  taskRoute: createRoute<{ taskId: string }>(),
  createTaskRoute: createRoute<{ projectId: string }>(),
  editTaskRoute: createRoute<{ taskId: string }>(),
  adminEditRoute: createRoute<{ adminId: string }>(),
};

const routeObjects = [
  { path: '/', route: routes.homeRoute },
  { path: '/users-admin-panel', route: routes.usersAdminPanelRoute },
  { path: '/admin-panel', route: routes.adminsPanelRoute },
  { path: '/profile', route: routes.profileRoute },
  { path: '/users-admin-panel/user/:userId/edit', route: routes.userEditRoute },
  { path: '/admin-panel/admin/:adminId/edit', route: routes.adminEditRoute },
  { path: '/projects', route: routes.projectsRoute },
  { path: '/projects/archive', route: routes.archivedProjectsRoute },
  { path: '/project/:projectId/manage', route: routes.projectManagementRoute },
  { path: '/project/:projectId', route: routes.projectRoute },
  { path: '/create-task/:projectId', route: routes.createTaskRoute },
  { path: '/edit-task/:taskId', route: routes.editTaskRoute },
  { path: '/task/:taskId', route: routes.taskRoute },
];

export const router = createHistoryRouter({ routes: routeObjects, controls });

const history = featureToggles.isSsr
  ? createMemoryHistory()
  : createBrowserHistory();

router.setHistory(history);
