import { createStore } from 'effector';

import { UserType } from '@pms-ui/entities/user';
import { header as pageHeader } from '@pms-ui/widgets/header';

const $userType = createStore<UserType>('admin');

export const headerModel = pageHeader.model.createModel({ $userType });
