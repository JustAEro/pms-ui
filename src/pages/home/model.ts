import { combine, createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

import { UserType } from '@pms-ui/entities/user';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const openModal = createEvent();
export const closeModal = createEvent();
export const loginEdited = createEvent<string>();
export const passwordEdited = createEvent<string>();
export const loginButtonClicked = createEvent();
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
const $userType = createStore<UserType>(null);

export const headerModel = pageHeader.model.createModel({ $userType });

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
  clock: reset,
  target: [
    $login.reinit,
    $loginModalIsOpened.reinit,
    $password.reinit,
  ] as const,
});
