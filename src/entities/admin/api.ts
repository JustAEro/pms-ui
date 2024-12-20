import { createEffect } from 'effector';

import { Admin, CreateAdmin } from './types';

let adminsList: Admin[] = [
  {
    login: 'seg_fault',
    firstName: 'Segun',
    lastName: 'Adebayo',
  },
  {
    login: 'mark_down',
    firstName: 'Mark',
    lastName: 'Chandler',
  },
  {
    login: 'sirgay_lazar',
    firstName: 'Lazar',
    lastName: 'Nikolov',
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchAdminsMockFx = createEffect(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ token }: { token: string }) =>
    new Promise<Admin[]>((resolve) => {
      setTimeout(() => {
        resolve(adminsList);
      }, 1000);
    })
);

export const fetchAdminsFx = fetchAdminsMockFx;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addAdminMockFx = createEffect(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ token, admin }: { token: string; admin: CreateAdmin }) =>
    new Promise<Admin>((resolve) => {
      setTimeout(() => {
        adminsList = [...adminsList, admin];
        resolve(admin);
      }, 200);
    })
);

export const addAdminFx = addAdminMockFx;
