import { AxiosError } from 'axios';
import { createEffect } from 'effector';

import { instance } from '@pms-ui/shared/api';

import { CreateUserDto, FindUserDto } from '../user';

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

const addAdminApiFx = createEffect(
  async ({ admin }: { admin: CreateUserDto }) => {
    try {
      const response = await instance.post<FindUserDto>(`/users`, admin);

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

export const addAdminFx = addAdminApiFx;

export const mapCreatedAdminDtoToAdmin = (dto: FindUserDto): Admin => ({
  login: dto.username,
  firstName: dto.first_name,
  lastName: dto.last_name,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteAdminMockFx = createEffect(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ token, login }: { token: string; login: Admin['login'] }) =>
    new Promise<Admin | undefined>((resolve) => {
      setTimeout(() => {
        const admin = structuredClone(
          adminsList.find((admin) => admin.login === login)
        );

        adminsList = adminsList.filter((admin) => admin.login !== login);

        resolve(admin);
      }, 200);
    })
);

export const deleteAdminFx = deleteAdminMockFx;
