import { Link } from 'atomic-router-react';
import { modelView } from 'effector-factorio';
import { useUnit } from 'effector-react';

import { Box, Image, Link as LinkComponent, Text } from '@chakra-ui/react';
import { UserType } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import logo from '@pms-ui/shared/ui/assets/svg/pms-logo.svg';

import { headerFactory } from './model';

export const Header = modelView(headerFactory, () => {
  const model = headerFactory.useModel();
  const userType = useUnit(model.ui.$userType);
  return (
    <Box display="flex" alignItems="center" height="70px" bgColor="#2B6CB0">
      <Link to={routes.homeRoute}>
        <Image
          paddingLeft="40px"
          marginLeft="10px"
          src={logo}
          w="100px"
          h="40px"
          alt=""
        />
      </Link>
      {linksForUserType(userType)}
    </Box>
  );
});

const linksForUserType = (userType: UserType) => {
  switch (userType) {
    case 'admin':
      return (
        <>
          <Text>
            <LinkComponent color="#61dafb">
              <Link to={routes.loginRoute}>Пользователи системы</Link>
            </LinkComponent>
          </Text>
          <Text>
            <LinkComponent color="#61dafb">
              <Link to={routes.loginRoute}>Администраторы системы</Link>
            </LinkComponent>
          </Text>
        </>
      );
    case 'user':
      return (
        <Text>
          <LinkComponent color="#61dafb">
            <Link to={routes.loginRoute}>Проекты</Link>
          </LinkComponent>
        </Text>
      );
    default:
      return null;
  }
};
