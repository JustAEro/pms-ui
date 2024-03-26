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
  loginRoute: createRoute(),
};

const routeObjects: UnmappedRouteObject<RouteParams>[] = [
  { path: '/', route: routes.homeRoute },
  { path: '/login', route: routes.loginRoute },
];

export const router = createHistoryRouter({ routes: routeObjects });

const history = featureToggles.isSsr
  ? createMemoryHistory()
  : createBrowserHistory();

router.setHistory(history);
