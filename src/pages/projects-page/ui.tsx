import { useUnit } from 'effector-react';
import { FC, useEffect } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { $canCreateProjects } from '@pms-ui/entities/user';
import { header as pageHeader } from '@pms-ui/widgets/header';

import {
  $areProjectsLoading,
  $projectsToShow,
  $searchValue,
  headerModel,
  pageMounted,
  searchValueChanged,
} from './model';

const textFontSizes = [16, 21, 30];

export const ProjectsPage: FC = () => {
  const onPageMount = useUnit(pageMounted);

  const canCreateProjects = useUnit($canCreateProjects);
  const areProjectsLoading = useUnit($areProjectsLoading);
  const projects = useUnit($projectsToShow);

  const searchValue = useUnit($searchValue);
  const onSearchProjectName = useUnit(searchValueChanged);

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
                <Button width="33%" colorScheme="gray">
                  Создать проект
                </Button>
              )}

              <Button textOverflow="ellipsis" width="33%" colorScheme="gray">
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
          </>
        )}
      </Flex>
    </Box>
  );
};
