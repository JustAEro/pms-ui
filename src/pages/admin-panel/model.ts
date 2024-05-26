import { combine, createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

import { Admin } from '@pms-ui/entities/admin';
import { $userType } from '@pms-ui/entities/user';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const pageMounted = createEvent();

export const openAddAdminModal = createEvent();
export const closeAddAdminModal = createEvent();
export const loginEdited = createEvent<string>();
export const firstNameEdited = createEvent<string>();
export const lastNameEdited = createEvent<string>();
export const passwordEdited = createEvent<string>();
export const addAdminButtonClicked = createEvent();

export const openDeleteAdminModal = createEvent<Admin['login']>();
export const closeDeleteAdminModal = createEvent();
export const deleteAdminButtonClicked = createEvent();

const reset = createEvent();

export const $deleteAdminModalIsOpened = createStore(false);
export const $adminLoginToBeDeleted = createStore<Admin['login']>('');

export const $addAdminModalIsOpened = createStore(false);
export const $login = createStore('');
export const $password = createStore('');
export const $firstName = createStore('');
export const $lastName = createStore('');
const $isAddAdminButtonEnabled = combine(
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
export const $isAddAdminButtonDisabled = not($isAddAdminButtonEnabled);

export const headerModel = pageHeader.model.createModel({ $userType });

// sample({
//   clock: pageMounted,
//   source: $userType,
//   filter: (userType) => userType !== 'admin',
//   target: routes.homeRoute.open,
// });

sample({
  clock: openDeleteAdminModal,
  source: $deleteAdminModalIsOpened,
  filter: (deleteAdminModalIsOpened) => !deleteAdminModalIsOpened,
  fn: () => true,
  target: $deleteAdminModalIsOpened,
});

sample({
  clock: openDeleteAdminModal,
  target: $adminLoginToBeDeleted,
});

sample({
  clock: closeDeleteAdminModal,
  source: $deleteAdminModalIsOpened,
  filter: (deleteAdminModalIsOpened) => deleteAdminModalIsOpened,
  fn: () => false,
  target: $deleteAdminModalIsOpened,
});

sample({
  clock: openAddAdminModal,
  source: $addAdminModalIsOpened,
  filter: (addAdminModalIsOpened) => !addAdminModalIsOpened,
  fn: () => true,
  target: $addAdminModalIsOpened,
});

sample({
  clock: closeAddAdminModal,
  source: $addAdminModalIsOpened,
  filter: (addAdminModalIsOpened) => addAdminModalIsOpened,
  fn: () => false,
  target: $addAdminModalIsOpened,
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
  clock: [closeAddAdminModal, closeDeleteAdminModal],
  target: reset,
});

sample({
  clock: reset,
  target: [
    $login.reinit,
    $firstName.reinit,
    $lastName.reinit,
    $addAdminModalIsOpened.reinit,
    $password.reinit,
    $deleteAdminModalIsOpened.reinit,
    $adminLoginToBeDeleted.reinit,
  ] as const,
});
