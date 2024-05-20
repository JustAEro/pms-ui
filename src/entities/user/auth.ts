import { createStore } from 'effector';

import { UserType } from './types';

export const $userType = createStore<UserType>('admin');
