import { createEffect, createEvent, createStore, sample } from 'effector';
import { persist } from 'effector-storage/local';

import { User } from './types';

export const authStarted = createEvent();
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
      canCreateProjects: false,
      userType: 'user',
    };
    return user;
  }
  if (token) {
    const user: User = {
      id: '1',
      login: 'default_man',
      firstName: 'Joe',
      lastName: 'Jones',
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
      userType: 'user',
    };
    return user;
  }

  return null;
});
const getTokenFx = createEffect(
  ({ login, password }: { login: string; password: string }) => {
    if (login === 'seg_fault' && password === 'V++') {
      return 'AMAMAM' as string;
    }
    if (login === 'null_ex' && password === 'TRASH') {
      return 'BIMBAMBUM' as string;
    }
    if (login && password) {
      return `${login}-${password}`;
    }

    return null;
  }
);

export const $user = createStore<User | null>(null);
export const $userType = $user.map((user) => user?.userType ?? null);
export const $canCreateProjects = $user.map(
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
  target: $user,
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
  target: $user,
});

sample({
  clock: validateTokenFx.fail,
  fn: () => null,
  target: $user,
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
  target: [$jwtToken, authStarted] as const,
});
