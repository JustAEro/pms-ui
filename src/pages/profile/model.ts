import { createEvent, sample } from 'effector';

import { $userType } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const pageMounted = createEvent();

export const headerModel = pageHeader.model.createModel({ $userType });

sample({
  clock: pageMounted,
  source: $userType,
  filter: (userType) => userType === null,
  target: routes.homeRoute.open,
});
