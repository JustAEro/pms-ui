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
import { header as pageHeader } from '@pms-ui/widgets/header';

import {
  $archivedProjectsToShow,
  $areArchivedProjectsLoading,
  $searchValue,
  headerModel,
  pageMounted,
  projectsPageButtonClicked,
  searchValueChanged,
} from './model';

const textFontSizes = [16, 21, 30];

export const ArchiveProjectsPage: FC = () => {
  const onPageMount = useUnit(pageMounted);

  const areArchivedProjectsLoading = useUnit($areArchivedProjectsLoading);

  const onProjectsPageButtonClick = useUnit(projectsPageButtonClicked);

  const searchValue = useUnit($searchValue);
  const onSearchProjectName = useUnit(searchValueChanged);

  const archivedProjects = useUnit($archivedProjectsToShow);

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
            Архивированные проекты
          </Text>
        </Flex>
        {areArchivedProjectsLoading && <Spinner marginTop="30px" />}
        {!areArchivedProjectsLoading && (
          <>
            <Flex
              marginTop="30px"
              paddingLeft="50px"
              paddingRight="50px"
              width="100%"
              direction="row"
              justifyContent="space-between"
              gap={10}
            >
              <Button
                onClick={onProjectsPageButtonClick}
                textOverflow="ellipsis"
                width="33%"
                colorScheme="gray"
              >
                Список проектов
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
              {archivedProjects.map((project) => (
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
