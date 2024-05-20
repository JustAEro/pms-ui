import { Route, RouterProvider } from 'atomic-router-react';
import { useUnit } from 'effector-react';
import { FC } from 'react';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { $userType, UserType } from '@pms-ui/entities/user';
import { AdminsPanelPage } from '@pms-ui/pages/admin-panel';
import { HomePage } from '@pms-ui/pages/home';
import { ProfilePage } from '@pms-ui/pages/profile';
import { UsersAdminPanelPage } from '@pms-ui/pages/users-admin-panel';
import { router, routes } from '@pms-ui/shared/routes';
import { theme } from '@pms-ui/shared/ui';

export const App: FC = () => {
  const userType = useUnit($userType);

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <RouterProvider router={router}>
        <Route route={routes.homeRoute} view={homePageView(userType)} />
        <Route route={routes.usersAdminPanelRoute} view={UsersAdminPanelPage} />
        <Route route={routes.adminsPanelRoute} view={AdminsPanelPage} />
        <Route route={routes.profileRoute} view={ProfilePage} />
      </RouterProvider>
    </ChakraProvider>
  );
};

const homePageView = (userType: UserType) => {
  switch (userType) {
    case 'admin':
      return UsersAdminPanelPage;
    case 'user':
      return HomePage; // TODO: add common user home page
    default:
      return HomePage;
  }
};
