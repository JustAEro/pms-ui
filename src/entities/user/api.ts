import { createEffect } from 'effector';

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
  },
  {
    id: '3',
    login: 'sirgay_lazar',
    firstName: 'Lazar',
    lastName: 'Nikolov',
    projects: [],
    canCreateProjects: true,
  },
];

export const fetchUsersFx = createEffect(
  async () =>
    new Promise<User[]>((resolve) => {
      setTimeout(() => {
        resolve(usersList);
      }, 1000);
    })
);

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
