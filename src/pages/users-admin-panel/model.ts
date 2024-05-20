import { combine, createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

import { $userType } from '@pms-ui/entities/user';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const openModal = createEvent();
export const closeModal = createEvent();
export const loginEdited = createEvent<string>();
export const firstNameEdited = createEvent<string>();
export const lastNameEdited = createEvent<string>();
export const passwordEdited = createEvent<string>();
export const addUserButtonClicked = createEvent();
const reset = createEvent();

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

export const headerModel = pageHeader.model.createModel({ $userType });

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
  clock: closeModal,
  target: reset,
});

sample({
  clock: reset,
  target: [
    $login.reinit,
    $firstName.reinit,
    $lastName.reinit,
    $addUserModalIsOpened.reinit,
    $password.reinit,
  ] as const,
});
