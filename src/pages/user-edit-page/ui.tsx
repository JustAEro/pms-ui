import { useUnit } from 'effector-react';
import { FC, useEffect } from 'react';

import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { header as pageHeader } from '@pms-ui/widgets/header';

import {
  $isUserToEditLoading,
  $userToEdit,
  headerModel,
  pageMounted,
} from './model';

const textFontSizes = [16, 21, 30];

export const UserEditPage: FC = () => {
  const userToEdit = useUnit($userToEdit);
  const isUserToEditLoading = useUnit($isUserToEditLoading);

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
        {isUserToEditLoading && <Spinner marginTop="30px" />}
        {!isUserToEditLoading && userToEdit && (
          <Text marginTop="30px" fontWeight="bold" fontSize={textFontSizes}>
            Редактирование пользователя {userToEdit.firstName}{' '}
            {userToEdit.lastName}
          </Text>
        )}
      </Flex>
    </Box>
  );
};
