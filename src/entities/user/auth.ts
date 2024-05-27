import axios, { AxiosError } from 'axios';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { persist } from 'effector-storage/local';
import { combineEvents } from 'patronum';

import { API_URL } from '@pms-ui/shared/config';

import { mapUserDtoToUser } from './mapping';
import { User } from './types';

export const authStarted = createEvent();
export const authSucceeded = createEvent<User>();
export const authFailed = createEvent<{ error: Error }>();
export const loginStarted = createEvent<{ login: string; password: string }>();
export const logoutStarted = createEvent();
const validateTokenStarted = createEvent<string>();

const validateTokenFx = createEffect(async (token: string) => {
  try {
    const response = await axios.request({
      url: `${API_URL}/users/profile`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'get',
    });
    console.log(response.data);
    return mapUserDtoToUser(response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data;
    }
    throw error;
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validateTokenMockFx = createEffect((token: string) => {
  if (token === 'AMAMAM') {
    const user: User = {
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
      userType: 'admin',
      password: '',
      position: '',
    };
    return user;
  }
  if (token === 'BIMBAMBUM') {
    const user: User = {
      id: '1',
      login: 'null_ex',
      firstName: 'Python',
      lastName: 'Enjoyer',
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
      canCreateProjects: true,
      userType: 'user',
      password: '',
      position: '',
    };
    return user;
  }

  throw Error('Authorization failed');
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getTokenMockFx = createEffect(
  ({ login, password }: { login: string; password: string }) => {
    if (login === 'seg_fault' && password === 'V++') {
      return 'AMAMAM' as string;
    }
    if (login === 'null_ex' && password === 'TRASH') {
      return 'BIMBAMBUM' as string;
    }

    throw Error('Authorization failed');
  }
);

const getTokenFx = createEffect(
  async ({ login, password }: { login: string; password: string }) => {
    try {
      const response = await axios.request({
        url: `${API_URL}/login`,
        method: 'post',
        params: {
          login,
          password,
        },
      });

      return response.data.access_token;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data;
      }
      throw error;
    }
  }
);

export const $currentUser = createStore<User | null>(null);
export const $userType = $currentUser.map((user) => user?.userType ?? null);
export const $canCreateProjects = $currentUser.map(
  (user) => user?.canCreateProjects ?? false
);

export const $jwtToken = createStore<string | null>(null);

persist({
  store: $jwtToken,
});

sample({
  clock: authStarted,
  source: $jwtToken,
  filter: (token): token is null => !token,
  fn: () => null,
  target: $currentUser,
});

sample({
  clock: authStarted,
  source: $jwtToken,
  filter: (token): token is string => !!token,
  target: validateTokenStarted,
});

sample({
  clock: validateTokenStarted,
  target: validateTokenFx,
});

sample({
  clock: validateTokenFx.doneData,
  target: [$currentUser, authSucceeded] as const,
});

sample({
  clock: validateTokenFx.fail,
  fn: () => null,
  target: $currentUser,
});

sample({
  clock: loginStarted,
  target: getTokenFx,
});

sample({
  clock: getTokenFx.doneData,
  target: [$jwtToken, authStarted] as const,
});

sample({
  clock: getTokenFx.fail,
  fn: () => null,
  target: [$jwtToken, authStarted] as const,
});

sample({
  clock: logoutStarted,
  fn: () => null,
  target: [$jwtToken, $currentUser] as const,
});

sample({
  clock: [getTokenFx.failData, validateTokenFx.failData],
  fn: (error) => ({ error }),
  target: authFailed,
});

export const loginSucceeded = combineEvents({ loginStarted, authSucceeded });
