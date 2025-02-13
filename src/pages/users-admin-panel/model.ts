import {
  attach,
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { not, or, spread } from 'patronum';

import {
  fetchProjectsOfUserApiFx,
  FindProjectDto,
  findProjectDtoToProject,
} from '@pms-ui/entities/project';
import {
  $jwtToken,
  $userType,
  addUserToSystemFx,
  CreateUserDto,
  fetchUserFx,
  fetchUsersFx,
  User,
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

const fetchUsersWithPaginationFx = attach({
  source: $jwtToken,
  async effect(token, params: { limit: number; offset: number }) {
    const findUsersPaginationDto = await fetchUsersFx({
      pageSize: params.limit,
      pageIndex: params.offset,
    });

    const findUserDtos = await Promise.all(
      findUsersPaginationDto.items.map(async (dto) =>
        fetchUserFx({ userId: dto.id })
      )
    );

    let projectsOfUsers: Record<string, FindProjectDto[]> = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const dto of findUsersPaginationDto.items) {
      // eslint-disable-next-line no-await-in-loop
      const projects = await fetchProjectsOfUserApiFx({ userId: dto.id });

      projectsOfUsers = {
        ...projectsOfUsers,
        [dto.id]: projects,
      };
    }

    const users: User[] = findUsersPaginationDto.items.map((dto) => {
      const findUserDto = findUserDtos.find((user) => user.id === dto.id);

      if (!findUserDto) {
        throw new Error('Verbose user info not found');
      }

      const projectsOfUser = projectsOfUsers[dto.id];

      if (!projectsOfUser) {
        throw new Error('Projects of user not found');
      }

      return {
        id: dto.id,
        login: dto.username,
        firstName: findUserDto.first_name,
        lastName: findUserDto.last_name,
        canCreateProjects: true,
        userType: 'user',
        position: findUserDto.position,
        password: '',
        projects: projectsOfUser.map((dto) => findProjectDtoToProject(dto)),
      };
    });

    return users;
  },
});

const fetchPagesCountFx = attach({
  source: $jwtToken,
  async effect(token, params: { limit: number }) {
    if (!token) {
      throw new Error('No auth token');
    }

    const users = await fetchUsersFx({ pageSize: params.limit, pageIndex: 1 });

    return Math.ceil(users.total / users.page_size);
  },
});

const addUserToSystemScopedFx = attach({ effect: addUserToSystemFx });
const changeIsAllowedToCreateProjectsForUserFx = createEffect(
  async ({ id, newStatus }: { id: string; newStatus: boolean }) =>
    // send query to backend to update is allowed to create projects for user

    new Promise<{ id: string; newStatus: boolean }>((resolve) => {
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
export const $isUsersListLoading = fetchUsersWithPaginationFx.pending;

export const $isDisabledCheckboxToChangeAllowToCreateProjects = or(
  changeIsAllowedToCreateProjectsForUserFx.pending,
  fetchUsersWithPaginationFx.pending
);
export const $usersAllowedToCreateProjectsCheckboxesState = createStore<
  Record<string, boolean>
>({});

const $usersLimitOnPage = createStore(5);

export const headerModel = pageHeader.model.createModel({ $userType });

export const usersPagination = createPagination({
  limit: $usersLimitOnPage,
  effect: fetchUsersWithPaginationFx,
  mapParams: ({ page, limit }) => ({ limit, offset: page + 1 }),
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
  clock: usersPagination.$currentItems,
  fn: (users) =>
    Object.fromEntries(users.map((user) => [user.id, user.canCreateProjects])),
  target: $usersAllowedToCreateProjectsCheckboxesState,
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
    login: $login,
    firstName: $firstName,
    lastName: $lastName,
    password: $password,
  },
  fn: ({ login, firstName, lastName, password }) => {
    const createUser: CreateUserDto = {
      username: login,
      first_name: firstName,
      last_name: lastName,
      middle_name: '', // TODO: add later
      password,
      position: 'Пользователь системы',
      is_admin: false,
    };

    return {
      createUser,
    };
  },
  target: addUserToSystemScopedFx,
});

sample({
  clock: addUserToSystemScopedFx.doneData,
  source: {
    usersLimitOnPage: $usersLimitOnPage,
  },
  fn: ({ usersLimitOnPage }) => ({
    fetchPagesCount: { limit: usersLimitOnPage },
    loadPageFx: { page: 0 },
    pageNumberChanged: 0,
    resetModalState: undefined,
  }),
  target: spread({
    fetchPagesCount: fetchPagesCountFx,
    loadPageFx: usersPagination.loadPageFx,
    pageNumberChanged,
    resetModalState,
  }),
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
  source: {
    usersAllowedToCreateProjectsCheckboxesState:
      $usersAllowedToCreateProjectsCheckboxesState,
  },
  fn: (
    { usersAllowedToCreateProjectsCheckboxesState },
    { result: { id, newStatus } }
  ) => ({
    ...usersAllowedToCreateProjectsCheckboxesState,
    [id]: newStatus,
  }),
  target: $usersAllowedToCreateProjectsCheckboxesState,
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
  target: [
    resetModalState,
    $currentPageNumber.reinit,
    usersPagination.reset,
  ] as const,
});
