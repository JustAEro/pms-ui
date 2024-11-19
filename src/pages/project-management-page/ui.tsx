import { useUnit } from 'effector-react';
import { FC, useEffect } from 'react';
import { useUnmount } from 'usehooks-ts';

import { ChevronLeftIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import { PencilIcon } from '@pms-ui/shared/ui';
import archiveIcon from '@pms-ui/shared/ui/assets/svg/archive-icon.svg';
import trashIcon from '@pms-ui/shared/ui/assets/svg/trash-icon.svg';
import { header as pageHeader } from '@pms-ui/widgets/header';

import {
  $addUserLoginFieldValue,
  $adminsMap,
  $editProjectModalDescription,
  $editProjectModalName,
  $isConfirmEditProjectButtonDisabled,
  $isMembersOfProjectLoading,
  $isProjectArchived,
  $isProjectEditInProgress,
  $isProjectLoading,
  $isSaveChangesAndCancelChangesButtonsDisabled,
  $isUpdateAdminsOfProjectInProgress,
  $membersOfProject,
  $project,
  $userToBeDeleted,
  addUserLoginFieldValueChanged,
  addUserModal,
  adminCheckboxChecked,
  archiveProjectModal,
  backToProjectButtonClicked,
  confirmAddUserToProjectButtonClicked,
  confirmArchiveProjectButtonClicked,
  confirmDeleteUserFromProjectButtonClicked,
  confirmEditProjectButtonClicked,
  deleteFromProjectModal,
  deleteUserFromProjectButtonClicked,
  discardChangesButtonClicked,
  editProjectModal,
  headerModel,
  pageMounted,
  pageUnmounted,
  projectDescriptionInEditModalChanged,
  projectNameInEditModalChanged,
  saveChangesButtonClicked,
} from './model';

const textFontSizes = [16, 21, 30];

export const ProjectManagementPage: FC = () => {
  const onPageMount = useUnit(pageMounted);
  const onPageUnmount = useUnit(pageUnmounted);

  const project = useUnit($project);
  const isProjectLoading = useUnit($isProjectLoading);
  const isProjectArchived = useUnit($isProjectArchived);
  const isProjectEditInProgress = useUnit($isProjectEditInProgress);
  const isConfirmEditProjectButtonDisabled = useUnit(
    $isConfirmEditProjectButtonDisabled
  );

  const membersOfProject = useUnit($membersOfProject);
  const adminsMap = useUnit($adminsMap);
  const isMembersOfProjectLoading = useUnit($isMembersOfProjectLoading);

  const userToBeDeleted = useUnit($userToBeDeleted);

  const addUserLoginFieldValue = useUnit($addUserLoginFieldValue);
  const onAddUserLoginFieldValueChange = useUnit(addUserLoginFieldValueChanged);

  const editProjectModalDescription = useUnit($editProjectModalDescription);
  const editProjectModalName = useUnit($editProjectModalName);
  const onProjectNameInEditModalChange = useUnit(projectNameInEditModalChanged);
  const onProjectDescriptionInEditModalChange = useUnit(
    projectDescriptionInEditModalChanged
  );

  const onOpenAddUserModal = useUnit(addUserModal.inputs.open);
  const onCloseAddUserModal = useUnit(addUserModal.inputs.close);
  const addUserModalIsOpened = useUnit(addUserModal.ui.$isOpened);

  const onOpenEditProjectModal = useUnit(editProjectModal.inputs.open);
  const onCloseEditProjectModal = useUnit(editProjectModal.inputs.close);
  const editProjectModalIsOpened = useUnit(editProjectModal.ui.$isOpened);

  const onOpenArchiveProjectModal = useUnit(archiveProjectModal.inputs.open);
  const onCloseArchiveProjectModal = useUnit(archiveProjectModal.inputs.close);
  const archiveProjectModalIsOpened = useUnit(archiveProjectModal.ui.$isOpened);

  const onOpenDeleteUserFromProjectModal = useUnit(
    deleteUserFromProjectButtonClicked
  );
  const onCloseDeleteUserFromProjectModal = useUnit(
    deleteFromProjectModal.inputs.close
  );
  const deleteUserFromProjectModalIsOpened = useUnit(
    deleteFromProjectModal.ui.$isOpened
  );
  const onConfirmDeleteUserFromProjectButtonClick = useUnit(
    confirmDeleteUserFromProjectButtonClicked
  );

  const onBackToProjectButtonClick = useUnit(backToProjectButtonClicked);

  const onConfirmEditProjectButtonClick = useUnit(
    confirmEditProjectButtonClicked
  );

  const onConfirmAddUserToProjectButtonClick = useUnit(
    confirmAddUserToProjectButtonClicked
  );

  const onConfirmArchiveProjectButtonClick = useUnit(
    confirmArchiveProjectButtonClicked
  );

  const onAdminCheckboxCheck = useUnit(adminCheckboxChecked);

  const isSaveChangesAndCancelChangesButtonsDisabled = useUnit(
    $isSaveChangesAndCancelChangesButtonsDisabled
  );

  const onSaveChangesButtonClick = useUnit(saveChangesButtonClicked);
  const onDiscardChangesButtonClick = useUnit(discardChangesButtonClicked);

  const isUpdateAdminsOfProjectInProgress = useUnit(
    $isUpdateAdminsOfProjectInProgress
  );

  useEffect(() => {
    onPageMount();
  }, [onPageMount]);

  useUnmount(() => {
    onPageUnmount();
  });

  return (
    <Box>
      <pageHeader.ui model={headerModel} />
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        fontSize="3xl"
      >
        {isProjectLoading && <Spinner marginTop="30px" />}
        {project && (
          <Flex
            marginTop="30px"
            direction="column"
            alignItems="center"
            gap="20px"
          >
            <Flex direction="row" alignItems="center" gap="20px">
              <ChevronLeftIcon
                onClick={onBackToProjectButtonClick}
                cursor="pointer"
                marginRight="2vw"
                marginLeft="-3vw"
                w="30px"
                h="30px"
              />
              <Text fontWeight="bold" fontSize={textFontSizes}>
                Управление проектом {project.name}
              </Text>
              {!isProjectArchived && (
                <PencilIcon onClick={onOpenEditProjectModal} />
              )}
              <Box marginLeft="2vw" marginRight="-3vw">
                <Tooltip
                  label={
                    isProjectArchived
                      ? 'Разархивировать проект'
                      : 'Архивировать проект'
                  }
                  placement="top"
                >
                  <Image
                    onClick={onOpenArchiveProjectModal}
                    cursor="pointer"
                    w="20px"
                    h="20px"
                    src={archiveIcon}
                  />
                </Tooltip>
              </Box>
            </Flex>

            {isMembersOfProjectLoading && (
              <Flex justifyContent="center" alignItems="center">
                <Spinner />
              </Flex>
            )}

            {!isMembersOfProjectLoading && (
              <>
                <TableContainer
                  border="1px solid"
                  borderColor="#E2E8F0"
                  borderRadius="6px"
                  marginTop="30px"
                >
                  <Table size="sm" variant="striped">
                    <Thead height="40px">
                      <Tr>
                        <Th>Имя пользователя</Th>
                        <Th>Администратор проекта</Th>
                        <Th>Удаление пользователя из проекта</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {membersOfProject.map((user) => (
                        <Tr key={user.id} height="40px">
                          <Td>{`${user.firstName} ${user.lastName}`}</Td>
                          <Td>
                            <Flex alignItems="center" justifyContent="center">
                              <Checkbox
                                isChecked={adminsMap[user.id]}
                                onChange={() => {
                                  onAdminCheckboxCheck(user.id);
                                }}
                                disabled={!!isProjectArchived}
                                border="1px solid"
                                borderColor="#E2E8F0"
                                borderRadius="6px"
                                bgColor="#FFFFFF"
                              />
                            </Flex>
                          </Td>
                          <Td>
                            <Flex justifyContent="center">
                              <Image
                                onClick={() => {
                                  if (!isProjectArchived) {
                                    onOpenDeleteUserFromProjectModal(user);
                                  }
                                }}
                                cursor={
                                  !isProjectArchived ? 'pointer' : 'not-allowed'
                                }
                                src={trashIcon}
                                alt=""
                                w="18px"
                                h="18px"
                              />
                            </Flex>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>

                {!isProjectArchived && (
                  <>
                    <Flex direction="row" marginTop="20px">
                      <Button
                        onClick={onSaveChangesButtonClick}
                        disabled={isSaveChangesAndCancelChangesButtonsDisabled}
                        variant="solid"
                        colorScheme="blue"
                      >
                        Сохранить изменения
                        {isUpdateAdminsOfProjectInProgress && (
                          <Spinner marginLeft="10px" />
                        )}
                      </Button>

                      <Spacer w="25px" />

                      <Button
                        onClick={onDiscardChangesButtonClick}
                        disabled={isSaveChangesAndCancelChangesButtonsDisabled}
                        variant="solid"
                        textColor="#3182CE"
                        backgroundColor="white"
                        border="1px solid #3182CE"
                      >
                        Отменить изменения
                      </Button>
                    </Flex>
                    <Button
                      onClick={onOpenAddUserModal}
                      marginTop="20px"
                      border="1px solid"
                      borderColor="#3182CE"
                      color="#3182CE"
                      bgColor="#FFFFFF"
                    >
                      + Добавить пользователя в проект
                    </Button>
                  </>
                )}
              </>
            )}
            <Modal
              size="xl"
              isOpen={addUserModalIsOpened}
              onClose={onCloseAddUserModal}
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
                      Добавление пользователя
                    </Text>
                  </Flex>
                </ModalHeader>
                <ModalBody>
                  <Spacer height="20px" />
                  <Flex alignItems="center" justifyContent="center">
                    <Input
                      value={addUserLoginFieldValue}
                      onChange={(e) =>
                        onAddUserLoginFieldValueChange(e.target.value)
                      }
                      width="80%"
                      variant="filled"
                      placeholder="Логин"
                    />
                  </Flex>
                  <Spacer height="50px" />
                  <Flex alignItems="center" justifyContent="center">
                    <Button
                      onClick={onConfirmAddUserToProjectButtonClick}
                      //   disabled={isAddAdminButtonDisabled}
                      width="80%"
                      variant="solid"
                      colorScheme="teal"
                    >
                      Добавить
                    </Button>
                  </Flex>
                  <Spacer height="20px" />
                </ModalBody>
              </ModalContent>
            </Modal>

            <Modal
              size="xl"
              isOpen={editProjectModalIsOpened}
              onClose={onCloseEditProjectModal}
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
                      Редактирование проекта
                    </Text>
                  </Flex>
                </ModalHeader>
                <ModalBody>
                  <Spacer height="20px" />

                  <FormControl>
                    <Flex
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <FormLabel>Название</FormLabel>
                      <Input
                        //   disabled={
                        //   isProjectCreationFormDisabledBecauseCreationPending
                        //   }
                        value={editProjectModalName}
                        onChange={(e) =>
                          onProjectNameInEditModalChange(e.target.value)
                        }
                        width="80%"
                        variant="filled"
                      />
                    </Flex>
                  </FormControl>

                  <Spacer height="20px" />
                  <FormControl>
                    <Flex
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <FormLabel>Описание</FormLabel>
                      <Textarea
                        //   disabled={
                        //   isProjectCreationFormDisabledBecauseCreationPending
                        //   }
                        value={editProjectModalDescription}
                        onChange={(e) =>
                          onProjectDescriptionInEditModalChange(e.target.value)
                        }
                        width="80%"
                        variant="filled"
                      />
                    </Flex>
                  </FormControl>
                  <Spacer height="50px" />
                  <Flex alignItems="center" justifyContent="center">
                    <Button
                      onClick={onConfirmEditProjectButtonClick}
                      disabled={isConfirmEditProjectButtonDisabled}
                      width="80%"
                      variant="solid"
                      colorScheme="teal"
                    >
                      Редактировать
                      {isProjectEditInProgress && <Spinner marginLeft="10px" />}
                    </Button>
                  </Flex>
                  <Spacer height="20px" />
                </ModalBody>
              </ModalContent>
            </Modal>

            <Modal
              size="xl"
              isOpen={archiveProjectModalIsOpened}
              onClose={onCloseArchiveProjectModal}
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
                      {isProjectArchived ? 'Разархивирование' : 'Архивирование'}{' '}
                      проекта
                    </Text>
                  </Flex>
                </ModalHeader>
                <ModalBody>
                  <Spacer height="20px" />
                  <Flex alignItems="center" justifyContent="center">
                    <Text width="80%" textAlign="center">
                      {`Вы действительно хотите ${
                        isProjectArchived ? 'разархивировать' : 'архивировать'
                      } проект
                     ${project.name}?`}
                    </Text>
                  </Flex>
                  <Spacer height="50px" />
                  <Flex alignItems="center" justifyContent="center">
                    <Button
                      onClick={onCloseArchiveProjectModal}
                      width="80%"
                      variant="solid"
                      textColor="#3182CE"
                      backgroundColor="white"
                      border="1px solid #3182CE"
                    >
                      Отмена
                    </Button>
                  </Flex>
                  <Spacer height="25px" />
                  <Flex alignItems="center" justifyContent="center">
                    <Button
                      onClick={onConfirmArchiveProjectButtonClick}
                      width="80%"
                      variant="solid"
                      colorScheme="blue"
                    >
                      {isProjectArchived ? 'Разархивировать' : 'Архивировать'}
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
                     ${userToBeDeleted?.login} из проекта?`}
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
                      onClick={() => {
                        const id = userToBeDeleted?.id;

                        if (id) {
                          onConfirmDeleteUserFromProjectButtonClick(id);
                        }
                      }}
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
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
