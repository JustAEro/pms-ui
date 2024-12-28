import { useUnit } from 'effector-react';
import { FC, useEffect } from 'react';
import { useBoolean } from 'usehooks-ts';

import {
  ChevronLeftIcon,
  CloseIcon,
  ViewIcon,
  ViewOffIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Image,
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
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import trashIcon from '@pms-ui/shared/ui/assets/svg/trash-icon.svg';
import { header as pageHeader } from '@pms-ui/widgets/header';

import {
  $deleteUserFromProjectModalIsOpened,
  $deleteUserModalIsOpened,
  $isDiscardChangesButtonEnabled,
  $isSaveChangesButtonEnabled,
  $isUserToEditLoading,
  $loginFieldValue,
  $nameFieldValue,
  $newPasswordFieldValue,
  $pageMode,
  $projects,
  $projectsOfUser,
  $projectToBeDeletedFrom,
  $surnameFieldValue,
  $userToEdit,
  addUserToProjectButtonClicked,
  backToDefaultPageClicked,
  closeDeleteUserFromProjectModal,
  closeDeleteUserModal,
  deleteUserButtonClicked,
  deleteUserFromProjectButtonClicked,
  discardChangesButtonClicked,
  headerModel,
  loginFieldChanged,
  nameFieldChanged,
  newPasswordFieldChanged,
  openDeleteUserFromProjectModal,
  openDeleteUserModal,
  pageMounted,
  pageUnmounted,
  projectToAddClicked,
  saveChangesButtonClicked,
  surnameFieldChanged,
} from './model';

const textFontSizes = [16, 21, 30];

export const UserEditPage: FC = () => {
  const loginFieldValue = useUnit($loginFieldValue);
  const onLoginFieldChange = useUnit(loginFieldChanged);

  const nameFieldValue = useUnit($nameFieldValue);
  const onNameFieldChange = useUnit(nameFieldChanged);

  const surnameFieldValue = useUnit($surnameFieldValue);
  const onSurnameFieldChange = useUnit(surnameFieldChanged);

  const newPasswordFieldValue = useUnit($newPasswordFieldValue);
  const onNewPasswordFieldChange = useUnit(newPasswordFieldChanged);

  const userToEdit = useUnit($userToEdit);
  const isUserToEditLoading = useUnit($isUserToEditLoading);

  const deleteUserModalIsOpened = useUnit($deleteUserModalIsOpened);
  const onOpenDeleteUserModal = useUnit(openDeleteUserModal);
  const onCloseDeleteUserModal = useUnit(closeDeleteUserModal);
  const onDeleteUserButtonClick = useUnit(deleteUserButtonClicked);

  const deleteUserFromProjectModalIsOpened = useUnit(
    $deleteUserFromProjectModalIsOpened
  );
  const onOpenDeleteUserFromProjectModal = useUnit(
    openDeleteUserFromProjectModal
  );
  const onCloseDeleteUserFromProjectModal = useUnit(
    closeDeleteUserFromProjectModal
  );
  const onDeleteUserFromProjectButtonClick = useUnit(
    deleteUserFromProjectButtonClicked
  );
  const projectToBeDeletedFrom = useUnit($projectToBeDeletedFrom);

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

  const pageMode = useUnit($pageMode);
  const onAddUserToProjectButtonClick = useUnit(addUserToProjectButtonClicked);
  const onBackToDefaultPageClick = useUnit(backToDefaultPageClicked);

  const projects = useUnit($projects);
  const projectsOfUser = useUnit($projectsOfUser);

  const onProjectToAddClick = useUnit(projectToAddClicked);

  return (
    <Box>
      <pageHeader.ui model={headerModel} />
      {pageMode === 'default' && (
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
                  Редактирование пользователя {userToEdit.firstName}{' '}
                  {userToEdit.lastName} ({userToEdit.login})
                </Text>
                <div style={{ marginBottom: '10px' }}>
                  <Tooltip
                    hasArrow
                    bgColor="#D9D9D9"
                    color="#000000"
                    label="Удаление пользователя"
                  >
                    <CloseIcon
                      onClick={onOpenDeleteUserModal}
                      width="14px"
                      height="14px"
                      cursor="pointer"
                    />
                  </Tooltip>
                </div>
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
              <Flex
                direction="column"
                alignItems="start"
                justifyContent="start"
              >
                <Text
                  marginTop="50px"
                  marginLeft="50px"
                  fontWeight="bold"
                  fontSize="18px"
                  alignSelf="center"
                >
                  Список проектов, в которых состоит данный пользователь
                </Text>
                <VStack
                  paddingBottom="10px"
                  marginTop="20px"
                  marginLeft="50px"
                  spacing="15px"
                >
                  {projectsOfUser.map((project) => (
                    <Box
                      width="50vw"
                      maxWidth="50vw"
                      bgColor="#D9D9D9"
                      key={project.id}
                      paddingLeft="20px"
                      paddingTop="10px"
                      paddingRight="20px"
                      paddingBottom="10px"
                    >
                      <Flex direction="column" justifyContent="start">
                        <Flex
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Text fontWeight="bold" fontSize="18px">
                            {project.name}
                          </Text>
                          <Tooltip
                            marginBottom="20px"
                            placement="top-start"
                            hasArrow
                            bgColor="#D9D9D9"
                            color="#000000"
                            label="Удаление пользователя из проекта"
                          >
                            <Image
                              onClick={() => {
                                onOpenDeleteUserFromProjectModal(project.id);
                              }}
                              cursor="pointer"
                              src={trashIcon}
                              alt=""
                              w="18px"
                              h="18px"
                            />
                          </Tooltip>
                        </Flex>

                        <Flex direction="row" alignItems="center" gap={5}>
                          <Text fontSize="18px">Администратор проекта</Text>
                          <Checkbox
                            borderColor="#000000"
                            bgColor="#FFFFFF"
                            colorScheme="blue"
                          />
                        </Flex>

                        <Text fontSize="18px">{project.description}</Text>
                      </Flex>
                    </Box>
                  ))}

                  <Button
                    onClick={onAddUserToProjectButtonClick}
                    variant="solid"
                    colorScheme="blue"
                  >
                    + Добавить пользователя в проект
                  </Button>
                </VStack>
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

              <Modal
                size="xl"
                isOpen={deleteUserFromProjectModalIsOpened}
                onClose={onCloseDeleteUserFromProjectModal}
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
                        Удаление пользователя из проекта
                      </Text>
                    </Flex>
                  </ModalHeader>
                  <ModalBody>
                    <Spacer height="20px" />
                    <Flex alignItems="center" justifyContent="center">
                      <Text width="80%" textAlign="justify">
                        {`Вы действительно хотите удалить пользователя
                     ${userToEdit.login} из проекта ${projectToBeDeletedFrom}?`}
                      </Text>
                    </Flex>
                    <Spacer height="50px" />
                    <Flex alignItems="center" justifyContent="center">
                      <Button
                        onClick={onCloseDeleteUserFromProjectModal}
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
                        onClick={onDeleteUserFromProjectButtonClick}
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
      )}

      {pageMode === 'addUserToProject' && (
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          fontSize="3xl"
        >
          <Flex
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap="20px"
          >
            <ChevronLeftIcon
              onClick={onBackToDefaultPageClick}
              cursor="pointer"
              marginTop="50px"
              w="30px"
              h="30px"
            />
            <Text
              marginTop="50px"
              fontWeight="bold"
              fontSize="18px"
              alignSelf="center"
            >
              Выберите проект, в который необходимо добавить пользователя
            </Text>
          </Flex>
          <VStack
            paddingBottom="10px"
            marginTop="20px"
            marginLeft="50px"
            spacing="15px"
          >
            {projects.map((project) => (
              <Box
                onClick={() => {
                  onProjectToAddClick(project);
                }}
                width="50vw"
                maxWidth="50vw"
                bgColor="#D9D9D9"
                key={project.id}
                paddingLeft="20px"
                paddingTop="10px"
                paddingRight="20px"
                paddingBottom="10px"
                cursor="pointer"
              >
                <Flex direction="column" justifyContent="start">
                  <Flex
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text fontWeight="bold" fontSize="18px">
                      {project.name}
                    </Text>
                  </Flex>
                  <Text fontSize="18px">{project.description}</Text>
                </Flex>
              </Box>
            ))}
          </VStack>
        </Flex>
      )}
    </Box>
  );
};
