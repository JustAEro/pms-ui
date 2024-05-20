import { FC } from 'react';

import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { header as pageHeader } from '@pms-ui/widgets/header';

import { headerModel } from './model';

const textFontSizes = [16, 21, 30];

export const ProfilePage: FC = () => (
  <Box>
    <pageHeader.ui model={headerModel} />
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
        marginLeft="130px"
        marginTop="40px"
        columns={2}
        spacingX={10}
        spacingY={5}
      >
        <Text fontSize="18px" fontWeight="bold">
          Логин
        </Text>
        <Text fontSize="18px">seg_fault</Text>
        <Text fontSize="18px" fontWeight="bold">
          Имя
        </Text>
        <Text fontSize="18px">Name</Text>
        <Text fontSize="18px" fontWeight="bold">
          Фамилия
        </Text>
        <Text fontSize="18px">Surname</Text>
        <Text fontSize="18px" fontWeight="bold">
          Роль
        </Text>
        <Text fontSize="18px">Администратор системы</Text>
      </SimpleGrid>
    </Flex>
  </Box>
);
