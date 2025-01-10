import { attach, combine, createEvent, createStore, sample } from 'effector';

import { Admin } from '@pms-ui/entities/admin';
import { Project } from '@pms-ui/entities/project';
import {
  $jwtToken,
  $userType,
  deleteUserFromSystemFx,
  fetchUserFx,
  updateUserMetaInSystemFx,
} from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const pageMounted = createEvent();
export const pageUnmounted = createEvent();
const reset = createEvent();

export const openDeleteUserModal = createEvent();
export const closeDeleteUserModal = createEvent();
export const deleteUserButtonClicked = createEvent();

export const openDeleteUserFromProjectModal = createEvent<Project['id']>();
export const closeDeleteUserFromProjectModal = createEvent();
export const deleteUserFromProjectButtonClicked = createEvent();

export const saveChangesButtonClicked = createEvent();
export const discardChangesButtonClicked = createEvent();
const resetFormState = createEvent();

const fetchUserScopedFx = attach({ effect: fetchUserFx });
const updateUserMetaInSystemScopedFx = attach({
  effect: updateUserMetaInSystemFx,
});

export const $loginFieldValue = createStore<string>('');
export const loginFieldChanged = createEvent<string>();
sample({
  clock: loginFieldChanged,
  target: $loginFieldValue,
});

export const $nameFieldValue = createStore<string>('');
export const nameFieldChanged = createEvent<string>();
sample({
  clock: nameFieldChanged,
  target: $nameFieldValue,
});

export const $surnameFieldValue = createStore<string>('');
export const surnameFieldChanged = createEvent<string>();
sample({
  clock: surnameFieldChanged,
  target: $surnameFieldValue,
});

export const $newPasswordFieldValue = createStore<string>('');
export const newPasswordFieldChanged = createEvent<string>();
sample({
  clock: newPasswordFieldChanged,
  target: $newPasswordFieldValue,
});

export const addUserToProjectButtonClicked = createEvent();
export const backToDefaultPageClicked = createEvent();

export const projectToAddClicked = createEvent<Project>();

const deleteUserFromSystemScopedFx = attach({ effect: deleteUserFromSystemFx });

export const $isSaveChangesButtonEnabled = combine(
  $nameFieldValue,
  $surnameFieldValue,
  $loginFieldValue,
  $newPasswordFieldValue,
  (name, surname, login, newPassword) =>
    name.length > 0 &&
    surname.length > 0 &&
    login.length > 0 &&
    newPassword.length > 0
);

const $isFormStateChanged = combine(
  $nameFieldValue,
  $surnameFieldValue,
  $loginFieldValue,
  $newPasswordFieldValue,
  (name, surname, login, newPassword) =>
    name !== $nameFieldValue.defaultState ||
    surname !== $surnameFieldValue.defaultState ||
    login !== $loginFieldValue.defaultState ||
    newPassword !== $newPasswordFieldValue.defaultState
);

export const $isDiscardChangesButtonEnabled = $isFormStateChanged;

export const $adminToEdit = createStore<Admin | null>(null);
export const $deleteUserModalIsOpened = createStore(false);

export const $deleteUserFromProjectModalIsOpened = createStore(false);
export const $projectToBeDeletedFrom = createStore<Project['id'] | null>(null);

export const $isUserToEditLoading = fetchUserScopedFx.pending;

export const $projects = createStore<Project[]>([]);

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
    routes.adminEditRoute.opened,
    routes.adminEditRoute.updated,
  ],
  source: {
    token: $jwtToken,
    userType: $userType,
    pageParams: routes.adminEditRoute.$params,
  },
  filter: ({ userType, token }) => userType === 'admin' && !!token,
  fn: ({ pageParams, token }) => ({
    userId: pageParams.adminId,
    token: token!,
  }),
  target: [fetchUserScopedFx] as const,
});

sample({
  clock: fetchUserScopedFx.doneData,
  target: $adminToEdit,
});

sample({
  clock: deleteUserButtonClicked,
  source: {
    userToEdit: $adminToEdit,
    token: $jwtToken,
  },
  filter: ({ token, userToEdit }) => !!token && !!userToEdit,
  fn: ({ token, userToEdit }) => ({
    user: userToEdit!,
    token: token!,
  }),
  target: deleteUserFromSystemScopedFx,
});

sample({
  clock: deleteUserFromSystemScopedFx.done,
  target: [closeDeleteUserModal, routes.adminsPanelRoute.open] as const,
});

sample({
  clock: openDeleteUserModal,
  source: $deleteUserModalIsOpened,
  filter: (deleteUserModalIsOpened) => !deleteUserModalIsOpened,
  fn: () => true,
  target: $deleteUserModalIsOpened,
});

sample({
  clock: closeDeleteUserModal,
  source: $deleteUserModalIsOpened,
  filter: (deleteUserModalIsOpened) => deleteUserModalIsOpened,
  fn: () => false,
  target: $deleteUserModalIsOpened,
});

sample({
  clock: openDeleteUserFromProjectModal,
  source: $deleteUserFromProjectModalIsOpened,
  filter: (deleteUserFromProjectModalIsOpened) =>
    !deleteUserFromProjectModalIsOpened,
  fn: () => true,
  target: $deleteUserFromProjectModalIsOpened,
});

sample({
  clock: closeDeleteUserFromProjectModal,
  source: $deleteUserFromProjectModalIsOpened,
  filter: (deleteUserFromProjectModalIsOpened) =>
    deleteUserFromProjectModalIsOpened,
  fn: () => false,
  target: $deleteUserFromProjectModalIsOpened,
});

sample({
  clock: openDeleteUserFromProjectModal,
  target: $projectToBeDeletedFrom,
});

sample({
  clock: closeDeleteUserFromProjectModal,
  target: $projectToBeDeletedFrom.reinit,
});

sample({
  clock: discardChangesButtonClicked,
  target: resetFormState,
});

sample({
  clock: saveChangesButtonClicked,
  source: {
    userToEdit: $adminToEdit,
    token: $jwtToken,
    nameFieldValue: $nameFieldValue,
    surnameFieldValue: $surnameFieldValue,
    loginFieldValue: $loginFieldValue,
    newPasswordFieldValue: $newPasswordFieldValue,
  },
  filter: ({ token, userToEdit }) => !!token && !!userToEdit,
  fn: ({
    token,
    userToEdit,
    nameFieldValue,
    surnameFieldValue,
    loginFieldValue,
    newPasswordFieldValue,
  }) => ({
    meta: {
      id: userToEdit!.id,
      firstName: nameFieldValue,
      lastName: surnameFieldValue,
      login: loginFieldValue,
      password: newPasswordFieldValue,
    },
    token: token!,
  }),
  target: updateUserMetaInSystemScopedFx,
});

sample({
  clock: updateUserMetaInSystemScopedFx.doneData,
  target: [
    $adminToEdit,
    $nameFieldValue.reinit,
    $surnameFieldValue.reinit,
    $loginFieldValue.reinit,
    $newPasswordFieldValue.reinit,
  ],
});

sample({
  clock: resetFormState,
  target: [
    $nameFieldValue.reinit,
    $loginFieldValue.reinit,
    $surnameFieldValue.reinit,
    $newPasswordFieldValue.reinit,
  ],
});

sample({
  clock: pageUnmounted,
  target: reset,
});

sample({
  clock: reset,
  target: [resetFormState] as const,
});
