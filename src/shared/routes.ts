import {
  createHistoryRouter,
  createRoute,
  RouteParams,
  UnmappedRouteObject,
} from 'atomic-router';
import { createBrowserHistory, createMemoryHistory } from 'history';

import { featureToggles } from './feature-toggles';

export const routes = {
  homeRoute: createRoute(),
  usersAdminPanelRoute: createRoute(),
  adminsPanelRoute: createRoute(),
  profileRoute: createRoute(),
};

const routeObjects: UnmappedRouteObject<RouteParams>[] = [
  { path: '/', route: routes.homeRoute },
  { path: '/users-admin-panel', route: routes.usersAdminPanelRoute },
  { path: '/admin-panel', route: routes.adminsPanelRoute },
  { path: '/profile', route: routes.profileRoute },
];

export const router = createHistoryRouter({ routes: routeObjects });

const history = featureToggles.isSsr
  ? createMemoryHistory()
  : createBrowserHistory();

router.setHistory(history);
