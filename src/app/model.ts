import { createEvent, sample } from 'effector';

import { authStarted } from '@pms-ui/entities/user';

export const appMounted = createEvent();

sample({
  clock: appMounted,
  target: authStarted,
});
