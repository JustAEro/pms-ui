import { createEffect, createEvent, createStore, sample } from 'effector';
import { persist } from 'effector-storage/local';
import { combineEvents } from 'patronum';

import { User } from './types';

export const authStarted = createEvent();
export const authSucceeded = createEvent<User>();
export const authFailed = createEvent<{ error: Error }>();
export const loginStarted = createEvent<{ login: string; password: string }>();
export const logoutStarted = createEvent();
const validateTokenStarted = createEvent<string>();

const validateTokenFx = createEffect((token: string) => {
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
    };
    return user;
  }

  throw Error('Authorization failed');
});
const getTokenFx = createEffect(
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

export const $currentUser = createStore<User | null>(null);
export const $userType = $currentUser.map((user) => user?.userType ?? null);
export const $canCreateProjects = $currentUser.map(
  (user) => user?.canCreateProjects ?? false
);

const $jwtToken = createStore<string | null>(null);

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
