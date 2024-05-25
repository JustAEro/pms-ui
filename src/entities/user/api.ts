import axios, { AxiosError } from 'axios';
import { createEffect } from 'effector';

import { API_URL } from '@pms-ui/shared/config';

import { User } from './types';

const usersList: User[] = [
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
      },
      {
        id: 'id2',
        name: 'DevRel',
        description: 'devRel',
      },
    ],
    canCreateProjects: false,
    userType: null,
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
      },
    ],
    canCreateProjects: true,
    userType: null,
  },
  {
    id: '3',
    login: 'sirgay_lazar',
    firstName: 'Lazar',
    lastName: 'Nikolov',
    projects: [],
    canCreateProjects: true,
    userType: null,
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchUsersMockFx = createEffect(
  async () =>
    new Promise<User[]>((resolve) => {
      setTimeout(() => {
        resolve(usersList);
      }, 1000);
    })
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchUsersApiFx = createEffect(async () => {
  try {
    const response = await axios.request<User[]>({
      url: `${API_URL}/users`,
      method: 'get',
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data;
    }
    throw error;
  }
});

export const fetchUsersFx = fetchUsersMockFx;

export const fetchUserFx = createEffect(
  async ({ userId }: { userId: string }) =>
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
