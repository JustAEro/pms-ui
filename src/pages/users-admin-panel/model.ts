import { attach, combine, createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

import {
  $jwtToken,
  $userType,
  addUserToSystemFx,
  fetchUsersFx,
  User,
  UserDto,
} from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const openModal = createEvent();
export const closeModal = createEvent();
export const loginEdited = createEvent<string>();
export const firstNameEdited = createEvent<string>();
export const lastNameEdited = createEvent<string>();
export const passwordEdited = createEvent<string>();
export const addUserButtonClicked = createEvent();
export const pageMounted = createEvent();
const reset = createEvent();

const fetchUsersScopedFx = attach({ effect: fetchUsersFx });
const addUserToSystemScopedFx = attach({ effect: addUserToSystemFx });

export const $usersList = createStore<User[]>([]);
export const $addUserModalIsOpened = createStore(false);
export const $login = createStore('');
export const $password = createStore('');
export const $firstName = createStore('');
export const $lastName = createStore('');
const $isAddUserButtonEnabled = combine(
  $login,
  $password,
  $firstName,
  $lastName,
  (login, password, firstName, lastName) =>
    login.length > 0 &&
    password.length > 0 &&
    firstName.length > 0 &&
    lastName.length > 0
);
export const $isAddUserButtonDisabled = not($isAddUserButtonEnabled);
export const $isUsersListLoading = fetchUsersScopedFx.pending;

export const headerModel = pageHeader.model.createModel({ $userType });

// sample({
//   clock: pageMounted,
//   source: $userType,
//   filter: (userType) => userType !== 'admin',
//   target: routes.homeRoute.open,
// });

sample({
  clock: [
    pageMounted,
    routes.usersAdminPanelRoute.opened,
    routes.usersAdminPanelRoute.updated,
  ],
  source: { token: $jwtToken, userType: $userType },
  filter: ({ userType, token }) => userType === 'admin' && !!token,
  fn: ({ token }) => ({ token: token! }),
  target: fetchUsersScopedFx,
});

sample({
  clock: fetchUsersScopedFx.doneData,
  target: $usersList,
});

sample({
  clock: openModal,
  source: $addUserModalIsOpened,
  filter: (addUserModalIsOpened) => !addUserModalIsOpened,
  fn: () => true,
  target: $addUserModalIsOpened,
});

sample({
  clock: closeModal,
  source: $addUserModalIsOpened,
  filter: (addUserModalIsOpened) => addUserModalIsOpened,
  fn: () => false,
  target: $addUserModalIsOpened,
});

sample({
  clock: loginEdited,
  target: $login,
});

sample({
  clock: firstNameEdited,
  target: $firstName,
});

sample({
  clock: lastNameEdited,
  target: $lastName,
});

sample({
  clock: passwordEdited,
  target: $password,
});

sample({
  clock: routes.usersAdminPanelRoute.closed,
  target: reset,
});

sample({
  clock: addUserButtonClicked,
  source: {
    jwtToken: $jwtToken,
    login: $login,
    firstName: $firstName,
    lastName: $lastName,
    password: $password,
  },
  filter: ({ jwtToken }) => !!jwtToken,
  fn: ({ jwtToken, login, firstName, lastName, password }) => {
    const user: UserDto = {
      login,
      firstName,
      lastName,
      password,
      position: 'Пользователь системы',
      isAdmin: false,
    };

    return {
      user,
      token: jwtToken!,
    };
  },
  target: addUserToSystemScopedFx,
});

sample({
  clock: addUserToSystemScopedFx.doneData,
  source: { token: $jwtToken, userType: $userType },
  filter: ({ userType, token }) => userType === 'admin' && !!token,
  fn: ({ token }) => ({ token: token! }),
  target: [reset, fetchUsersScopedFx],
});

sample({
  clock: reset,
  target: [
    $usersList.reinit,
    $login.reinit,
    $firstName.reinit,
    $lastName.reinit,
    $addUserModalIsOpened.reinit,
    $password.reinit,
  ] as const,
});
