import { Route, RouterProvider } from 'atomic-router-react';
import { FC } from 'react';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { HomePage } from '@pms-ui/pages/home';
import { LoginPage } from '@pms-ui/pages/login';
import { router, routes } from '@pms-ui/shared/routes';
import { theme } from '@pms-ui/shared/ui';

export const App: FC = () => (
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <RouterProvider router={router}>
      <Route route={routes.homeRoute} view={HomePage} />
      <Route route={routes.loginRoute} view={LoginPage} />
    </RouterProvider>
  </ChakraProvider>
);
