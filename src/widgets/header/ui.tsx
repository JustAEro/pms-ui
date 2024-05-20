import { Link } from 'atomic-router-react';
import { modelView } from 'effector-factorio';
import { useUnit } from 'effector-react';

import {
  Avatar,
  Box,
  Image,
  Link as LinkComponent,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import { UserType } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import logo from '@pms-ui/shared/ui/assets/svg/pms-logo.svg';

import { headerFactory } from './model';

export const Header = modelView(headerFactory, () => {
  const model = headerFactory.useModel();
  const userType = useUnit(model.ui.$userType);
  const onLogoutButtonClick = useUnit(model.ui.logoutButtonClicked);

  return (
    <Box display="flex" alignItems="center" height="70px" bgColor="#2B6CB0">
      <Link to={routes.homeRoute}>
        <Image marginLeft="50px" src={logo} w="60px" h="30px" alt="" />
      </Link>
      {linksForUserType(userType)}
      <Spacer />
      {userType && (
        <Menu>
          <MenuButton>
            <Avatar marginRight="50px" size="sm" />
          </MenuButton>
          <MenuList marginRight="50px">
            <MenuItem>Профиль</MenuItem>
            <MenuDivider />
            <MenuItem onClick={onLogoutButtonClick}>Выйти</MenuItem>
          </MenuList>
        </Menu>
      )}
    </Box>
  );
});

const linksForUserType = (userType: UserType) => {
  switch (userType) {
    case 'admin':
      return (
        <Stack marginLeft="70px" direction="row" spacing="70px">
          <LinkComponent color="#61dafb">
            <Link to={routes.usersAdminPanelRoute}>
              <Text color="#ffffff">Пользователи системы</Text>
            </Link>
          </LinkComponent>
          <LinkComponent color="#61dafb">
            <Link to={routes.adminsPanelRoute}>
              <Text color="#ffffff">Администраторы системы</Text>
            </Link>
          </LinkComponent>
        </Stack>
      );
    case 'user':
      return (
        <Stack marginLeft="70px" direction="row">
          <LinkComponent color="#61dafb">
            <Link to={routes.usersAdminPanelRoute}>
              <Text color="#ffffff">Проекты</Text>
            </Link>
          </LinkComponent>
        </Stack>
      );
    default:
      return null;
  }
};
