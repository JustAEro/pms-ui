import { attach, combine, createEvent, createStore, sample } from 'effector';

import {
  addUserToProjectMockFx,
  deleteUserFromProjectMockFx,
  fetchProjectsMockFx,
  fetchProjectsOfUserMockFx,
  Project,
} from '@pms-ui/entities/project';
import {
  $jwtToken,
  $userType,
  deleteUserFromSystemFx,
  fetchUserMockFx,
  updateUserMetaInSystemFx,
  User,
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

const fetchProjectsOfUserScopedFx = attach({
  effect: fetchProjectsOfUserMockFx,
});
const fetchUserScopedFx = attach({ effect: fetchUserMockFx });
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
const fetchProjectsScopedFx = attach({ effect: fetchProjectsMockFx });
const addUserToProjectScopedFx = attach({ effect: addUserToProjectMockFx });
const deleteUserFromProjectScopedFx = attach({
  effect: deleteUserFromProjectMockFx,
});

export const $isSaveChangesButtonEnabled = combine(
  $nameFieldValue,
  $surnameFieldValue,
  $loginFieldValue,
  $newPasswordFieldValue,
  (name, surname, login, newPassword) =>
    name.length > 0 &&
    surname.length > 0 &&
    login.length > 3 &&
    newPassword.length > 3
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

export const $userToEdit = createStore<User | null>(null);
export const $deleteUserModalIsOpened = createStore(false);

export const $deleteUserFromProjectModalIsOpened = createStore(false);
export const $projectToBeDeletedFrom = createStore<Project['id'] | null>(null);

export const $pageMode = createStore<'default' | 'addUserToProject'>('default');

export const $isUserToEditLoading = fetchUserScopedFx.pending;

export const $projects = createStore<Project[]>([]);
export const $projectsOfUser = createStore<Project[]>([]);

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
    routes.userEditRoute.opened,
    routes.userEditRoute.updated,
  ],
  source: {
    token: $jwtToken,
    userType: $userType,
    pageParams: routes.userEditRoute.$params,
  },
  filter: ({ userType, token }) => userType === 'admin' && !!token,
  fn: ({ pageParams, token }) => ({ userId: pageParams.userId, token: token! }),
  target: [fetchUserScopedFx, fetchProjectsOfUserScopedFx] as const,
});

sample({
  clock: fetchUserScopedFx.doneData,
  target: $userToEdit,
});

sample({
  clock: fetchProjectsOfUserScopedFx.doneData,
  target: $projectsOfUser,
});

sample({
  clock: deleteUserButtonClicked,
  source: {
    userToEdit: $userToEdit,
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
  target: [closeDeleteUserModal, routes.usersAdminPanelRoute.open] as const,
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
    userToEdit: $userToEdit,
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
    $userToEdit,
    $nameFieldValue.reinit,
    $surnameFieldValue.reinit,
    $loginFieldValue.reinit,
    $newPasswordFieldValue.reinit,
  ],
});

sample({
  clock: addUserToProjectButtonClicked,
  fn: () => 'addUserToProject' as const,
  target: [$pageMode, fetchProjectsScopedFx],
});

sample({
  clock: backToDefaultPageClicked,
  fn: () => 'default' as const,
  target: $pageMode,
});

sample({
  clock: fetchProjectsScopedFx.doneData,
  target: $projects,
});

sample({
  clock: projectToAddClicked,
  source: {
    userToEdit: $userToEdit,
    token: $jwtToken,
  },
  filter: ({ userToEdit, token }) => !!userToEdit && !!token,
  fn: ({ userToEdit, token }, project) => ({
    userId: userToEdit!.id,
    project,
    token: token!,
  }),
  target: addUserToProjectScopedFx,
});

sample({
  clock: addUserToProjectScopedFx.done,
  source: {
    projectsOfUser: $projectsOfUser,
  },
  fn: ({ projectsOfUser }, { params }) => [...projectsOfUser, params.project],
  target: $projectsOfUser,
});

sample({
  clock: addUserToProjectScopedFx.done,
  fn: () => 'default' as const,
  target: $pageMode,
});

sample({
  clock: deleteUserFromProjectButtonClicked,
  source: {
    userToEdit: $userToEdit,
    projectToBeDeletedFrom: $projectToBeDeletedFrom,
    token: $jwtToken,
  },
  filter: ({ userToEdit, projectToBeDeletedFrom, token }) =>
    !!userToEdit && !!projectToBeDeletedFrom && !!token,
  fn: ({ userToEdit, projectToBeDeletedFrom, token }) => ({
    userId: userToEdit!.id,
    projectId: projectToBeDeletedFrom!,
    token: token!,
  }),
  target: deleteUserFromProjectScopedFx,
});

sample({
  clock: deleteUserFromProjectScopedFx.doneData,
  source: $projectsOfUser,
  fn: (projectsOfUser, projectDeleted) =>
    projectsOfUser.filter((project) => project.id !== projectDeleted.id),
  target: $projectsOfUser,
});

sample({
  clock: deleteUserFromProjectScopedFx.doneData,
  target: closeDeleteUserFromProjectModal,
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
  target: [resetFormState, $pageMode.reinit],
});
