import { useUnit } from 'effector-react';
import { FC, useEffect } from 'react';
import { useBoolean } from 'usehooks-ts';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { header as pageHeader } from '@pms-ui/widgets/header';

import {
  $adminToEdit,
  $deleteUserModalIsOpened,
  $isDiscardChangesButtonEnabled,
  $isSaveChangesButtonEnabled,
  $isUserToEditLoading,
  $loginFieldValue,
  $nameFieldValue,
  $newPasswordFieldValue,
  $surnameFieldValue,
  closeDeleteUserModal,
  deleteUserButtonClicked,
  discardChangesButtonClicked,
  headerModel,
  loginFieldChanged,
  nameFieldChanged,
  newPasswordFieldChanged,
  pageMounted,
  pageUnmounted,
  saveChangesButtonClicked,
  surnameFieldChanged,
} from './model';

const textFontSizes = [16, 21, 30];

export const AdminEditPage: FC = () => {
  const loginFieldValue = useUnit($loginFieldValue);
  const onLoginFieldChange = useUnit(loginFieldChanged);

  const nameFieldValue = useUnit($nameFieldValue);
  const onNameFieldChange = useUnit(nameFieldChanged);

  const surnameFieldValue = useUnit($surnameFieldValue);
  const onSurnameFieldChange = useUnit(surnameFieldChanged);

  const newPasswordFieldValue = useUnit($newPasswordFieldValue);
  const onNewPasswordFieldChange = useUnit(newPasswordFieldChanged);

  const userToEdit = useUnit($adminToEdit);
  const isUserToEditLoading = useUnit($isUserToEditLoading);

  const deleteUserModalIsOpened = useUnit($deleteUserModalIsOpened);
  const onCloseDeleteUserModal = useUnit(closeDeleteUserModal);
  const onDeleteUserButtonClick = useUnit(deleteUserButtonClicked);

  const onPageMount = useUnit(pageMounted);
  const onPageUnmount = useUnit(pageUnmounted);

  const isSaveChangesButtonEnabled = useUnit($isSaveChangesButtonEnabled);
  const onSaveChangesButtonClick = useUnit(saveChangesButtonClicked);

  const isDiscardChangesButtonEnabled = useUnit($isDiscardChangesButtonEnabled);
  const onDiscardChangesButtonClick = useUnit(discardChangesButtonClicked);

  useEffect(() => {
    onPageMount();

    return () => onPageUnmount();
  }, [onPageMount, onPageUnmount]);

  const { value: showPassword, toggle: toggleShowPassword } = useBoolean(false);

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
          <>
            <Flex
              marginTop="30px"
              direction="row"
              alignItems="baseline"
              gap="20px"
            >
              <Text fontWeight="bold" fontSize={textFontSizes}>
                Редактирование администратора {userToEdit.firstName}{' '}
                {userToEdit.lastName} ({userToEdit.login})
              </Text>
            </Flex>

            <SimpleGrid
              spacingY={5}
              spacingX={10}
              alignItems="center"
              marginTop="40px"
              columns={2}
            >
              <Text fontSize="18px" fontWeight="bold">
                Логин
              </Text>
              <Input
                value={loginFieldValue}
                onChange={(e) => onLoginFieldChange(e.target.value)}
                variant="filled"
                width="120%"
              />
              <Text fontSize="18px" fontWeight="bold">
                Имя
              </Text>
              <Input
                value={nameFieldValue}
                onChange={(e) => onNameFieldChange(e.target.value)}
                variant="filled"
                width="120%"
              />
              <Text fontSize="18px" fontWeight="bold">
                Фамилия
              </Text>
              <Input
                value={surnameFieldValue}
                onChange={(e) => onSurnameFieldChange(e.target.value)}
                variant="filled"
                width="120%"
              />
              <Text fontSize="18px" fontWeight="bold">
                Пароль (новый)
              </Text>
              <InputGroup width="120%">
                <Input
                  value={newPasswordFieldValue}
                  onChange={(e) => onNewPasswordFieldChange(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  variant="filled"
                />
                <InputRightElement>
                  <Button
                    marginRight={2}
                    h="1.75rem"
                    size="sm"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </SimpleGrid>
            <Flex
              marginTop="30px"
              direction="row"
              alignItems="center"
              justifyContent="center"
              gap={10}
            >
              <Button
                disabled={!isSaveChangesButtonEnabled}
                onClick={onSaveChangesButtonClick}
                variant="solid"
                colorScheme="blue"
              >
                Сохранить изменения
              </Button>
              <Button
                disabled={!isDiscardChangesButtonEnabled}
                onClick={onDiscardChangesButtonClick}
                border="1px solid"
                borderColor="#3182CE"
                color="#3182CE"
                bgColor="#FFFFFF"
              >
                Отменить изменения
              </Button>
            </Flex>

            <Modal
              size="xl"
              isOpen={deleteUserModalIsOpened}
              onClose={onCloseDeleteUserModal}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalCloseButton />
                <ModalHeader>
                  <Flex
                    marginTop="10px"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontWeight="bold" fontSize={textFontSizes}>
                      Удаление пользователя
                    </Text>
                  </Flex>
                </ModalHeader>
                <ModalBody>
                  <Spacer height="20px" />
                  <Flex alignItems="center" justifyContent="center">
                    <Text width="80%" textAlign="justify">
                      {`Вы действительно хотите удалить пользователя
                     ${userToEdit.login}? Данное действие необратимо`}
                    </Text>
                  </Flex>
                  <Spacer height="50px" />
                  <Flex alignItems="center" justifyContent="center">
                    <Button
                      onClick={onCloseDeleteUserModal}
                      width="80%"
                      variant="solid"
                      colorScheme="blue"
                    >
                      Отмена
                    </Button>
                  </Flex>
                  <Spacer height="25px" />
                  <Flex alignItems="center" justifyContent="center">
                    <Button
                      onClick={onDeleteUserButtonClick}
                      width="80%"
                      variant="solid"
                      colorScheme="red"
                    >
                      Удалить
                    </Button>
                  </Flex>
                  <Spacer height="20px" />
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        )}
      </Flex>
    </Box>
  );
};
