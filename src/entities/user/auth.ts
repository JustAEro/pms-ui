import { createStore } from 'effector';

import { User, UserType } from './types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const $user = createStore<User | null>(null);
export const $userType = createStore<UserType>('user');
export const $canCreateProjects = createStore(true);
