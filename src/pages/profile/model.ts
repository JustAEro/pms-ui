import { $userType } from '@pms-ui/entities/user';
import { header as pageHeader } from '@pms-ui/widgets/header';

export const headerModel = pageHeader.model.createModel({ $userType });
