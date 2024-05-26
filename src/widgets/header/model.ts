import { createEvent, sample, Store } from 'effector';
import { modelFactory } from 'effector-factorio';

import { logoutStarted, UserType } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';

type HeaderFactoryOptions = {
  $userType: Store<UserType>;
};

export const headerFactory = modelFactory(
  ({ $userType }: HeaderFactoryOptions) => {
    const logoutButtonClicked = createEvent();

    sample({
      clock: logoutButtonClicked,
      target: logoutStarted,
    });

    sample({
      clock: logoutStarted,
      target: routes.homeRoute.open,
    });

    return {
      ui: {
        $userType,
        logoutButtonClicked,
      },
    };
  }
);
