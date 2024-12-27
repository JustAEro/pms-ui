import { useUnit } from 'effector-react';
import { FC, useEffect } from 'react';
import { useUnmount } from 'usehooks-ts';

import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
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
  Textarea,
} from '@chakra-ui/react';
import { $canCreateProjects } from '@pms-ui/entities/user';
import { header as pageHeader } from '@pms-ui/widgets/header';

import {
  $areProjectsLoading,
  $createProjectModalIsOpened,
  $isCreateProjectButtonDisabled,
  $isProjectCreationFormDisabledBecauseCreationPending,
  $projectDescription,
  $projectName,
  $projectsToShow,
  $searchValue,
  $currentPage,
  $totalPages,
  archivePageButtonClicked,
  createProjectButtonClicked,
  createProjectModalClosed,
  createProjectModalOpened,
  nextPageClicked,
  prevPageClicked,
  headerModel,
  pageMounted,
  pageUnmounted,
  projectClicked,
  projectDescriptionChanged,
  projectNameChanged,
  searchValueChanged,
} from './model';

const textFontSizes = [16, 21, 30];

export const ProjectsPage: FC = () => {
  const onPageMount = useUnit(pageMounted);
  const onPageUnmount = useUnit(pageUnmounted);

  const canCreateProjects = useUnit($canCreateProjects);
  const areProjectsLoading = useUnit($areProjectsLoading);
  const projects = useUnit($projectsToShow);

  const searchValue = useUnit($searchValue);
  const onSearchProjectName = useUnit(searchValueChanged);

  const onOpenCreateProjectModal = useUnit(createProjectModalOpened);
  const createProjectModalIsOpened = useUnit($createProjectModalIsOpened);
  const onCloseCreateProjectModal = useUnit(createProjectModalClosed);
  const projectName = useUnit($projectName);
  const projectDescription = useUnit($projectDescription);
  const onChangeProjectName = useUnit(projectNameChanged);
  const isCreateProjectButtonDisabled = useUnit($isCreateProjectButtonDisabled);
  const onChangeProjectDescription = useUnit(projectDescriptionChanged);
  const onCreateProjectButtonClick = useUnit(createProjectButtonClicked);

  const onArchivePageButtonClick = useUnit(archivePageButtonClicked);

  const onProjectClick = useUnit(projectClicked);

  const currentPage = useUnit($currentPage);
  const totalPages = useUnit($totalPages);
  const onNextPageClick = useUnit(nextPageClicked);
  const onPrevPageClick = useUnit(prevPageClicked);

  const isProjectCreationFormDisabledBecauseCreationPending = useUnit(
    $isProjectCreationFormDisabledBecauseCreationPending
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
        <Flex
          marginTop="30px"
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontWeight="bold" fontSize={textFontSizes}>
            Проекты
          </Text>
        </Flex>
        {areProjectsLoading && <Spinner marginTop="30px" />}
        {!areProjectsLoading && (
          <>
            <Flex
              marginTop="30px"
              paddingLeft="50px"
              paddingRight="50px"
              width="100%"
              direction="row"
              justifyContent={canCreateProjects ? 'center' : 'space-between'}
              gap={10}
            >
              {canCreateProjects && (
                <Button
                  onClick={onOpenCreateProjectModal}
                  width="33%"
                  colorScheme="gray"
                >
                  Создать проект
                </Button>
              )}

              <Button
                onClick={onArchivePageButtonClick}
                textOverflow="ellipsis"
                width="33%"
                colorScheme="gray"
              >
                Архив проектов
              </Button>

              <InputGroup width="33%">
                <InputLeftAddon>
                  <SearchIcon />
                </InputLeftAddon>
                <Input
                  value={searchValue}
                  onChange={(e) => {
                    onSearchProjectName(e.target.value);
                  }}
                  placeholder="Название проекта"
                />
              </InputGroup>
            </Flex>
            <SimpleGrid
              minChildWidth="250px"
              width="100%"
              marginTop="30px"
              marginBottom="30px"
              paddingLeft="50px"
              paddingRight="50px"
              spacing={6}
              columns={4}
            >
              {projects.map((project) => (
                <Box
                  cursor="pointer"
                  onClick={() => {
                    onProjectClick({ projectId: project.id });
                  }}
                  key={project.id}
                  overflowY="hidden"
                  textOverflow="ellipsis"
                  height="250px"
                  paddingTop="10px"
                  paddingLeft="30px"
                  paddingRight="30px"
                  paddingBottom="30px"
                  bgColor="#EDF2F7"
                >
                  <Text fontSize="20px" fontWeight="bold">
                    {project.name}
                  </Text>
                  <Text textOverflow="ellipsis" fontSize="20px">
                    {project.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
            <Flex justifyContent="center" alignItems="center" marginTop="20px">
              <Button
                onClick={onPrevPageClick}
                disabled={currentPage <= 1}
                marginRight="10px"
              >
                Предыдущая
              </Button>
              <Text>{`${currentPage} из ${totalPages}`}</Text>
              <Button
                onClick={onNextPageClick}
                disabled={currentPage >= totalPages}
                marginLeft="10px"
              >
                Следующая
              </Button>
            </Flex>
            <Modal
              size="xl"
              isOpen={createProjectModalIsOpened}
              onClose={onCloseCreateProjectModal}
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
                      Создание проекта
                    </Text>
                  </Flex>
                </ModalHeader>
                <ModalBody>
                  <Spacer height="20px" />
                  <Flex alignItems="center" justifyContent="center">
                    <Input
                      disabled={
                        isProjectCreationFormDisabledBecauseCreationPending
                      }
                      value={projectName}
                      onChange={(e) => onChangeProjectName(e.target.value)}
                      width="80%"
                      variant="filled"
                      placeholder="Название"
                    />
                  </Flex>
                  <Spacer height="20px" />
                  <Flex alignItems="center" justifyContent="center">
                    <Textarea
                      disabled={
                        isProjectCreationFormDisabledBecauseCreationPending
                      }
                      value={projectDescription}
                      onChange={(e) =>
                        onChangeProjectDescription(e.target.value)
                      }
                      width="80%"
                      variant="filled"
                      placeholder="Описание"
                    />
                  </Flex>
                  <Spacer height="50px" />
                  <Flex alignItems="center" justifyContent="center">
                    <Button
                      onClick={onCreateProjectButtonClick}
                      disabled={
                        isCreateProjectButtonDisabled ||
                        isProjectCreationFormDisabledBecauseCreationPending
                      }
                      width="80%"
                      variant="solid"
                      colorScheme="teal"
                    >
                      Создать
                      {isProjectCreationFormDisabledBecauseCreationPending && (
                        <Spinner marginLeft="10px" />
                      )}
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
