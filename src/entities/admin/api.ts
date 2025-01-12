import { AxiosError } from 'axios';
import { createEffect } from 'effector';

import { instance } from '@pms-ui/shared/api';

import {
  CreateUserDto,
  fetchUserFx,
  FindUserDto,
  FindUsersPaginationDto,
  UpdateUserDto,
  UpdateUserMeta,
} from '../user';

import { Admin, CreateAdmin } from './types';

let adminsList: Admin[] = [
  {
    login: 'seg_fault',
    firstName: 'Segun',
    lastName: 'Adebayo',
    id: '1',
  },
  {
    login: 'mark_down',
    firstName: 'Mark',
    lastName: 'Chandler',
    id: '2',
  },
  {
    login: 'sirgay_lazar',
    firstName: 'Lazar',
    lastName: 'Nikolov',
    id: '3',
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

const fetchAdminsApiFx = createEffect(async () => {
  try {
    const {
      data: { total },
    } = await instance.get<FindUsersPaginationDto>(
      `/users?isAdmin=true&pageIndex=1&pageSize=1`
    );

    const {
      data: { items },
    } = await instance.get<FindUsersPaginationDto>(
      `/users?isAdmin=true&pageIndex=1&pageSize=${total}`
    );

    return items;
  } catch (error) {
    console.log(error);

    if (error instanceof AxiosError) {
      throw error.response?.data;
    }

    throw error;
  }
});

export const fetchAdminsFx = fetchAdminsApiFx;

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
  id: dto.id,
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

const deleteAdminApiFx = createEffect(
  async ({ userId }: { userId: string }) => {
    try {
      await instance.delete(`/users/${userId}`);
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError) {
        throw error.response?.data;
      }

      throw error;
    }
  }
);

export const deleteAdminFx = deleteAdminApiFx;

export const updateAdminMetaInSystemApiFx = createEffect(
  async ({
    newMeta,
    adminToUpdate,
  }: {
    newMeta: UpdateUserMeta;
    adminToUpdate: Admin;
  }) => {
    const updateDto: UpdateUserDto = {
      username: newMeta.login,
      first_name: newMeta.firstName,
      last_name: newMeta.lastName,
      password: newMeta.password,
      position: 'Администратор системы',
      is_admin: true,
      middle_name: '',
    };

    await instance.put<FindUserDto>(`/users/${adminToUpdate.id}`, updateDto);

    const user = await fetchUserFx({ userId: adminToUpdate.id });

    const admin: Admin = {
      id: user.id,
      login: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
    };

    return admin;
  }
);
