import { useUnit } from 'effector-react';
import { FC, useEffect } from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';
import { header as pageHeader } from '@pms-ui/widgets/header';

import { headerModel, pageMounted } from './model';

const textFontSizes = [16, 21, 30];

export const TaskPage: FC = () => {
  const onPageMount = useUnit(pageMounted);

  useEffect(() => {
    onPageMount();
  }, [onPageMount]);

  return (
    <Box>
      <pageHeader.ui model={headerModel} />
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        fontSize="3xl"
      >
        <Flex
          marginTop="30px"
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontWeight="bold" fontSize={textFontSizes}>
            Задача
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};
