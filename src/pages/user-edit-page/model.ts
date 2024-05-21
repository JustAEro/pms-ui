import { attach, createEvent, createStore, sample } from 'effector';

import { $userType, fetchUserFx, User } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const pageMounted = createEvent();

const fetchUserScopedFx = attach({ effect: fetchUserFx });

export const $userToEdit = createStore<User | null>(null);

export const $isUserToEditLoading = fetchUserScopedFx.pending;

export const headerModel = pageHeader.model.createModel({ $userType });

sample({
  clock: [
    pageMounted,
    routes.userEditRoute.opened,
    routes.userEditRoute.updated,
  ],
  source: { userType: $userType, pageParams: routes.userEditRoute.$params },
  filter: ({ userType }) => userType === 'admin',
  fn: ({ pageParams }) => pageParams.userId,
  target: fetchUserScopedFx,
});

sample({
  clock: fetchUserScopedFx.doneData,
  target: $userToEdit,
});
