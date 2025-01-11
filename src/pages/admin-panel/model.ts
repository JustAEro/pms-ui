import { attach, combine, createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

import {
  addAdminFx,
  Admin,
  deleteAdminFx,
  fetchAdminsFx,
  mapCreatedAdminDtoToAdmin,
} from '@pms-ui/entities/admin';
import { $jwtToken, $userType, CreateUserDto } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const pageMounted = createEvent();

export const openAddAdminModal = createEvent();
export const closeAddAdminModal = createEvent();
export const loginEdited = createEvent<string>();
export const firstNameEdited = createEvent<string>();
export const lastNameEdited = createEvent<string>();
export const passwordEdited = createEvent<string>();
export const addAdminButtonClicked = createEvent();

export const openDeleteAdminModal = createEvent<Admin['id']>();
export const closeDeleteAdminModal = createEvent();
export const deleteAdminButtonClicked = createEvent();

export const editAdminButtonClicked = createEvent<{ adminId: string }>();

const reset = createEvent();

const fetchAdminsScopedFx = attach({ effect: fetchAdminsFx });
const addAdminScopedFx = attach({ effect: addAdminFx });
const deleteAdminScopedFx = attach({ effect: deleteAdminFx });

export const $adminsList = createStore<Admin[]>([]);
export const $isAdminsListLoading = fetchAdminsScopedFx.pending;
export const $deleteAdminModalIsOpened = createStore(false);
export const $adminIdToBeDeleted = createStore<Admin['id']>('');

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
  clock: [
    pageMounted,
    routes.adminsPanelRoute.opened,
    routes.adminsPanelRoute.updated,
  ],
  source: {
    jwtToken: $jwtToken,
  },
  filter: ({ jwtToken }) => !!jwtToken,
  fn: ({ jwtToken }) => ({
    token: jwtToken!,
  }),
  target: fetchAdminsScopedFx,
});

sample({
  clock: fetchAdminsScopedFx.doneData,
  fn: (dto): Admin[] =>
    dto.map((adminDto) => ({
      id: adminDto.id,
      login: adminDto.username,
      firstName: adminDto.full_name.split(' ')[0] ?? '',
      lastName: adminDto.full_name.split(' ')[1] ?? '',
    })),
  target: $adminsList,
});

sample({
  clock: addAdminButtonClicked,
  source: {
    login: $login,
    firstName: $firstName,
    lastName: $lastName,
    password: $password,
    jwtToken: $jwtToken,
  },
  fn: ({ login, firstName, lastName, password }) => {
    const admin: CreateUserDto = {
      username: login,
      first_name: firstName,
      last_name: lastName,
      password,
      is_admin: true,
      middle_name: '',
      position: 'Администратор системы',
    };

    return {
      admin,
    };
  },
  target: addAdminScopedFx,
});

sample({
  clock: addAdminScopedFx.doneData,
  source: {
    adminsList: $adminsList,
  },
  fn: ({ adminsList }, createdAdmin) => [
    ...adminsList,
    mapCreatedAdminDtoToAdmin(createdAdmin),
  ],
  target: $adminsList,
});

sample({
  clock: addAdminScopedFx.doneData,
  target: closeAddAdminModal,
});

sample({
  clock: deleteAdminButtonClicked,
  source: {
    adminIdToBeDeleted: $adminIdToBeDeleted,
  },
  fn: ({ adminIdToBeDeleted }) => ({
    userId: adminIdToBeDeleted,
  }),
  target: deleteAdminScopedFx,
});

sample({
  clock: deleteAdminScopedFx.done,
  source: {
    adminsList: $adminsList,
  },
  fn: ({ adminsList }, { params }) =>
    adminsList.filter((admin) => admin.id !== params.userId),
  target: $adminsList,
});

sample({
  clock: deleteAdminScopedFx.doneData,
  target: closeDeleteAdminModal,
});

sample({
  clock: openDeleteAdminModal,
  source: $deleteAdminModalIsOpened,
  filter: (deleteAdminModalIsOpened) => !deleteAdminModalIsOpened,
  fn: () => true,
  target: $deleteAdminModalIsOpened,
});

sample({
  clock: openDeleteAdminModal,
  target: $adminIdToBeDeleted,
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
  clock: editAdminButtonClicked,
  target: routes.adminEditRoute.open,
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
    $adminIdToBeDeleted.reinit,
  ] as const,
});
