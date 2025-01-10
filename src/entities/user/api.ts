import { AxiosError } from 'axios';
import { createEffect } from 'effector';

import { instance } from '@pms-ui/shared/api';

import {
  CreateUserDto,
  FindUserDto,
  FindUsersPaginationDto,
  UpdateUserMeta,
  User,
} from './types';

let usersList: User[] = [
  {
    id: '1',
    login: 'seg_fault',
    firstName: 'Segun',
    lastName: 'Adebayo',
    projects: [
      {
        id: 'id1',
        name: 'S_JIRO',
        description: 's_jiro',
        is_active: true,
      },
      {
        id: 'id2',
        name: 'DevRel',
        description: 'devRel',
        is_active: true,
      },
    ],
    canCreateProjects: false,
    userType: null,
    password: '',
    position: '',
  },
  {
    id: '2',
    login: 'mark_down',
    firstName: 'Mark',
    lastName: 'Chandler',
    projects: [
      {
        id: 'id3',
        name: 'Developer',
        description: 'dev_to',
        is_active: true,
      },
    ],
    canCreateProjects: true,
    userType: null,
    password: '',
    position: '',
  },
  {
    id: '3',
    login: 'sirgay_lazar',
    firstName: 'Lazar',
    lastName: 'Nikolov',
    projects: [],
    canCreateProjects: true,
    userType: null,
    password: '',
    position: '',
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchUsersMockFx = createEffect(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ token }: { token: string }) =>
    new Promise<User[]>((resolve) => {
      setTimeout(() => {
        resolve(usersList);
      }, 1000);
    })
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchUsersApiFx = createEffect(
  async ({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }) => {
    try {
      const response = await instance.get<FindUsersPaginationDto>(
        `/users?isAdmin=false&pageIndex=${pageIndex}&pageSize=${pageSize}`
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data;
      }
      throw error;
    }
  }
);

export const fetchUsersFx = fetchUsersApiFx;

export const fetchUserMockFx = createEffect(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ userId, token }: { userId: string; token: string }) =>
    new Promise<User>((resolve) => {
      setTimeout(() => {
        const foundUser = usersList.find((user) => user.id === userId);

        if (foundUser) {
          resolve(foundUser);
        } else {
          throw new Error(`User with id ${userId} is not found`);
        }
      }, 1000);
    })
);

export const fetchUserFx = createEffect(
  async ({ userId }: { userId: string }) => {
    try {
      const response = await instance.get<FindUserDto>(`/users/${userId}`);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data;
      }
      throw error;
    }
  }
);

export const addUserToSystemFx = createEffect(
  async ({ createUser }: { createUser: CreateUserDto }) => {
    try {
      const response = await instance.post<FindUserDto>(`/users`, createUser);

      console.log(response.data);

      return response.data;
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError) {
        throw error.response?.data;
      }

      throw error;
    }
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteUserFromSystemMockFx = createEffect(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ user, token }: { user: User; token: string }) =>
    new Promise<User | undefined>((resolve) => {
      setTimeout(() => {
        const { id } = user;

        const deletedUser = structuredClone(
          usersList.find((user) => user.id === id)
        );

        usersList = usersList.filter((user) => user.id !== id);

        resolve(deletedUser);
      }, 200);
    })
);

export const deleteUserFromSystemFx = deleteUserFromSystemMockFx;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateUserMetaInSystemMockFx = createEffect(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ meta, token }: { meta: UpdateUserMeta; token: string }) =>
    new Promise<User>((resolve, reject) => {
      setTimeout(() => {
        const { id, firstName, lastName, login, password } = meta;

        const updatedUserIndex = usersList.findIndex((user) => user.id === id);

        const updatedUser = usersList[updatedUserIndex];

        if (!updatedUser) {
          reject(new Error('User to update not found'));
        }

        updatedUser!.firstName = firstName;
        updatedUser!.lastName = lastName;
        updatedUser!.login = login;
        updatedUser!.password = password;

        resolve(structuredClone(updatedUser!));
      }, 200);
    })
);

export const updateUserMetaInSystemFx = updateUserMetaInSystemMockFx;
