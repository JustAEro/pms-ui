import { createEvent, sample, Store } from 'effector';
import { modelFactory } from 'effector-factorio';

import { logoutStarted, UserType } from '@pms-ui/entities/user';

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

    return {
      ui: {
        $userType,
        logoutButtonClicked,
      },
    };
  }
);
