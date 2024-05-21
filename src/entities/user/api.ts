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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (id: string) =>
    new Promise<User>((resolve) => {
      setTimeout(
        () =>
          resolve({
            id,
            login: `login_${id}`,
            firstName: `firstName_${id}`,
            lastName: `lastName_${id}`,
            projects: [],
            canCreateProjects: false,
          }),
        1000
      );
    })
);
