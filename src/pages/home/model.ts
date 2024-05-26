import { redirect } from 'atomic-router';
import { combine, createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

import {
  $userType,
  authFailed,
  loginStarted,
  loginSucceeded,
} from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { errorToastModelFactory } from '@pms-ui/shared/ui';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const pageMounted = createEvent();
export const pageUnmounted = createEvent();

export const openModal = createEvent();
export const closeModal = createEvent();
export const loginEdited = createEvent<string>();
export const passwordEdited = createEvent<string>();
export const loginButtonClicked = createEvent();
const redirectToAdminMainPageTriggered = createEvent();
const reset = createEvent();

export const $loginModalIsOpened = createStore(false);
export const $login = createStore('');
export const $password = createStore('');
const $isLoginButtonEnabled = combine(
  $login,
  $password,
  (login, password) => login.length > 0 && password.length > 0
);
export const $isLoginButtonDisabled = not($isLoginButtonEnabled);

export const headerModel = pageHeader.model.createModel({ $userType });

const errorAuthToastModel = errorToastModelFactory({
  triggerEvent: authFailed,
  notificationOptions: {
    status: 'error',
    duration: 9000,
    isClosable: true,
  },
});

export const { $notificationToShow, $notificationToastId } =
  errorAuthToastModel.outputs;

// sample({
//   clock: authSucceeded,
//   source: $userType,
//   filter: (userType) => userType === 'admin',
//   target: redirectToAdminMainPageTriggered,
// });

sample({
  clock: loginSucceeded,
  filter: ({ authSucceeded: authSucceededUser }) =>
    authSucceededUser.userType === 'admin',
  target: redirectToAdminMainPageTriggered,
});

sample({
  clock: loginSucceeded,
  filter: ({ authSucceeded: authSucceededUser }) =>
    authSucceededUser.userType === 'user',
  target: routes.projectsRoute.open,
});

// sample({
//   clock: [routes.homeRoute.opened, routes.homeRoute.updated],
//   source: $userType,
//   filter: (userType) => userType === 'admin',
//   target: redirectToAdminMainPageTriggered,
// });

redirect({
  clock: redirectToAdminMainPageTriggered,
  route: routes.usersAdminPanelRoute,
});

// sample({
//   clock: [routes.homeRoute.opened, routes.homeRoute.updated],
//   source: $userType,
//   filter: (userType) => userType === 'user',
//   target: routes.projectsRoute.open,
// });

sample({
  clock: openModal,
  source: $loginModalIsOpened,
  filter: (loginModalIsOpened) => !loginModalIsOpened,
  fn: () => true,
  target: $loginModalIsOpened,
});

sample({
  clock: closeModal,
  source: $loginModalIsOpened,
  filter: (loginModalIsOpened) => loginModalIsOpened,
  fn: () => false,
  target: $loginModalIsOpened,
});

sample({
  clock: loginEdited,
  target: $login,
});

sample({
  clock: passwordEdited,
  target: $password,
});

sample({
  clock: closeModal,
  target: reset,
});

sample({
  clock: loginButtonClicked,
  source: { login: $login, password: $password },
  target: loginStarted,
});

sample({
  clock: pageUnmounted,
  target: reset,
});

sample({
  clock: reset,
  target: [
    $login.reinit,
    $loginModalIsOpened.reinit,
    $password.reinit,
    errorAuthToastModel.inputs.reset,
  ] as const,
});
