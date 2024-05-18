import { Store } from 'effector';
import { modelFactory } from 'effector-factorio';

import { UserType } from '@pms-ui/entities/user';

type HeaderFactoryOptions = {
  $userType: Store<UserType>;
};

export const headerFactory = modelFactory(
  ({ $userType }: HeaderFactoryOptions) => ({
    ui: {
      $userType,
    },
  })
);
