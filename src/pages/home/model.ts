import { createStore } from 'effector';

import { UserType } from '@pms-ui/entities/user';
import { counter } from '@pms-ui/shared/ui';
import { header as pageHeader } from '@pms-ui/widgets/header';

const $userType = createStore<UserType>(null);

export const counterModel = counter.model.createModel();

export const headerModel = pageHeader.model.createModel({ $userType });
