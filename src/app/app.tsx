import { Route, RouterProvider } from 'atomic-router-react';
import { useUnit } from 'effector-react';
import { FC } from 'react';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { $userType, UserType } from '@pms-ui/entities/user';
import { AdminsPanelPage } from '@pms-ui/pages/admin-panel';
import { ArchiveProjectsPage } from '@pms-ui/pages/archive-projects-page';
import { HomePage } from '@pms-ui/pages/home';
import { ProfilePage } from '@pms-ui/pages/profile';
import { ProjectPage } from '@pms-ui/pages/project-page';
import { ProjectsPage } from '@pms-ui/pages/projects-page';
import { UserEditPage } from '@pms-ui/pages/user-edit-page';
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
        <Route route={routes.userEditRoute} view={UserEditPage} />
        <Route route={routes.projectsRoute} view={ProjectsPage} />
        <Route
          route={routes.archivedProjectsRoute}
          view={ArchiveProjectsPage}
        />
        <Route route={routes.projectRoute} view={ProjectPage} />
      </RouterProvider>
    </ChakraProvider>
  );
};

const homePageView = (userType: UserType) => {
  switch (userType) {
    case 'admin':
      return UsersAdminPanelPage;
    case 'user':
      return ProjectsPage;
    default:
      return HomePage;
  }
};
