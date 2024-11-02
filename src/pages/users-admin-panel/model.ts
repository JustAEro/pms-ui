import {
  attach,
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { not, or } from 'patronum';

import {
  $jwtToken,
  $userType,
  addUserToSystemFx,
  fetchUsersFx,
  User,
  UserDto,
} from '@pms-ui/entities/user';
import { createPagination } from '@pms-ui/shared/lib';
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
const resetModalState = createEvent();

export const allowToCreateProjectsCheckboxClicked = createEvent<{
  id: string;
  newStatus: boolean;
}>();

export const pageNumberChanged = createEvent<number>();

const reset = createEvent();

const fetchUsersScopedFx = attach({ effect: fetchUsersFx });
const fetchUsersWithPaginationFx = attach({
  source: $jwtToken,
  async effect(token, params: { limit: number; offset: number }) {
    if (!token) {
      throw new Error('No auth token');
    }

    const users = await fetchUsersFx({ token });
    console.log(params);

    const slicedUsers = structuredClone(users).slice(
      params.offset,
      params.offset + params.limit
    );
    console.log(slicedUsers);

    // await sleep(300);

    return slicedUsers;
  },
});
const fetchPagesCountFx = attach({
  source: $jwtToken,
  async effect(token, params: { limit: number }) {
    if (!token) {
      throw new Error('No auth token');
    }

    const users = await fetchUsersFx({ token });

    return Math.ceil(users.length / params.limit);
  },
});
const addUserToSystemScopedFx = attach({ effect: addUserToSystemFx });
const changeIsAllowedToCreateProjectsForUserFx = createEffect(
  async ({ id, newStatus }: { id: string; newStatus: boolean }) =>
    // send query to backend to update is allowed to create projects for user

    new Promise((resolve) => {
      // TODO: delete this after connect to real backend
      setTimeout(() => {
        resolve({
          id,
          newStatus,
        });
      }, 1000);
    })
);

export const $currentPageNumber = createStore(0);
export const $pagesCount = createStore(0);
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
    login.length > 3 &&
    password.length > 3 &&
    firstName.length > 0 &&
    lastName.length > 0
);
export const $isAddUserButtonDisabled = not($isAddUserButtonEnabled);
export const $isUsersListLoading = or(
  fetchUsersScopedFx.pending,
  fetchUsersWithPaginationFx.pending
);
export const $isDisabledCheckboxToChangeAllowToCreateProjects = or(
  changeIsAllowedToCreateProjectsForUserFx.pending,
  fetchUsersScopedFx.pending
);
export const $usersAllowedToCreateProjectsCheckboxesState = createStore<
  Record<string, boolean>
>({});

const $usersLimitOnPage = createStore(5);

export const headerModel = pageHeader.model.createModel({ $userType });

export const usersPagination = createPagination({
  limit: $usersLimitOnPage,
  effect: fetchUsersWithPaginationFx,
  mapParams: ({ page, limit }) => ({ limit, offset: page * limit }),
  mapResult: (users) => users,
});

sample({
  clock: [
    pageMounted,
    routes.usersAdminPanelRoute.opened,
    routes.usersAdminPanelRoute.updated,
  ],
  fn: () => ({ page: 0 }),
  target: usersPagination.loadPageFx,
});

sample({
  clock: [
    pageMounted,
    routes.usersAdminPanelRoute.opened,
    routes.usersAdminPanelRoute.updated,
  ],
  source: $usersLimitOnPage,
  fn: (limit) => ({ limit }),
  target: fetchPagesCountFx,
});

sample({
  clock: fetchPagesCountFx.doneData,
  target: $pagesCount,
});

sample({
  clock: pageNumberChanged,
  fn: (pageNumber) => ({ page: pageNumber }),
  target: usersPagination.loadPageFx,
});

sample({
  clock: pageNumberChanged,
  target: $currentPageNumber,
});

// sample({
//   clock: pageMounted,
//   source: $userType,
//   filter: (userType) => userType !== 'admin',
//   target: routes.homeRoute.open,
// });

sample({
  clock: [$usersList],
  fn: (users) =>
    Object.fromEntries(users.map((user) => [user.id, user.canCreateProjects])),
  target: $usersAllowedToCreateProjectsCheckboxesState,
});

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
  target: [$addUserModalIsOpened, resetModalState],
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
  clock: allowToCreateProjectsCheckboxClicked,
  target: changeIsAllowedToCreateProjectsForUserFx,
});

sample({
  clock: allowToCreateProjectsCheckboxClicked,
  source: $usersAllowedToCreateProjectsCheckboxesState,
  fn: (checkboxesState, { id, newStatus }) => ({
    ...checkboxesState,
    [id]: newStatus,
  }),
  target: $usersAllowedToCreateProjectsCheckboxesState,
});

sample({
  clock: changeIsAllowedToCreateProjectsForUserFx.done,
  source: { token: $jwtToken, userType: $userType },
  filter: ({ userType, token }) => userType === 'admin' && !!token,
  fn: ({ token }) => ({ token: token! }),
  target: fetchUsersScopedFx,
});

sample({
  clock: resetModalState,
  target: [
    $login.reinit,
    $firstName.reinit,
    $lastName.reinit,
    $password.reinit,
    $addUserModalIsOpened.reinit,
  ],
});

sample({
  clock: reset,
  target: [resetModalState, $usersList.reinit, usersPagination.reset] as const,
});
