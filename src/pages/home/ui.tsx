import { FC } from 'react';

import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { header as pageHeader } from '@pms-ui/widgets/header';

import { headerModel } from './model';

const textFontSizes = [16, 21, 30];

export const HomePage: FC = () => (
  <Box>
    <pageHeader.ui model={headerModel} />
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      fontSize="3xl"
    >
      <Text marginTop="50px" fontWeight="bold" fontSize={textFontSizes}>
        Добро пожаловать в систему управления проектами
      </Text>
      <Button
        marginTop="50px"
        colorScheme="teal"
        bgColor="#319795"
        width="50%"
        height="50px"
        variant="solid"
      >
        Вход
      </Button>
    </Flex>
  </Box>
);
