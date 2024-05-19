import { FC } from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';
import { header as pageHeader } from '@pms-ui/widgets/header';

import { headerModel } from './model';

const textFontSizes = [16, 21, 30];

export const UsersAdminPanelPage: FC = () => (
  <Box>
    <pageHeader.ui model={headerModel} />
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      fontSize="3xl"
    >
      <Text marginTop="50px" fontWeight="bold" fontSize={textFontSizes}>
        Управление правами пользователей системы
      </Text>
    </Flex>
  </Box>
);
