import { Link } from 'atomic-router-react';
import { useUnit } from 'effector-react';
import { FC, useEffect } from 'react';

import { Box, Flex, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { $currentUser, $userType } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { header as pageHeader } from '@pms-ui/widgets/header';

import { headerModel, pageMounted } from './model';

const textFontSizes = [16, 21, 30];

export const ProfilePage: FC = () => {
  const onPageMount = useUnit(pageMounted);

  const currentUser = useUnit($currentUser);
  const userType = useUnit($userType);

  useEffect(() => {
    onPageMount();
  }, [onPageMount]);

  return (
    <Box>
      <pageHeader.ui model={headerModel} />
      {currentUser && (
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          fontSize="3xl"
        >
          <Text marginTop="50px" fontWeight="bold" fontSize={textFontSizes}>
            Профиль
          </Text>

          <SimpleGrid
            marginLeft={userType === 'admin' ? '130px' : '50px'}
            marginTop="40px"
            columns={2}
            spacingX={10}
            spacingY={5}
          >
            <Text fontSize="18px" fontWeight="bold">
              Логин
            </Text>
            <Text fontSize="18px">{currentUser.login}</Text>
            <Text fontSize="18px" fontWeight="bold">
              ID
            </Text>
            <Text fontSize="18px">{currentUser.id}</Text>
            <Text fontSize="18px" fontWeight="bold">
              Имя
            </Text>
            <Text fontSize="18px">{currentUser.firstName}</Text>
            <Text fontSize="18px" fontWeight="bold">
              Фамилия
            </Text>
            <Text fontSize="18px">{currentUser.lastName}</Text>
            <Text fontSize="18px" fontWeight="bold">
              Роль
            </Text>
            <Text fontSize="18px">
              {userType === 'admin' && 'Администратор системы'}
              {userType === 'user' && 'Пользователь'}
            </Text>
          </SimpleGrid>
        </Flex>
      )}
    </Box>
  );
};
