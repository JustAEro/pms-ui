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
  $areClosedTasksLoading,
  $closedTasksToShow,
  $searchValue,
  headerModel,
  pageMounted,
  projectPageButtonClicked,
  searchValueChanged,
  taskClicked,
} from './model';

const textFontSizes = [16, 21, 30];

export const ClosedTasksOfProjectPage: FC = () => {
  const onPageMount = useUnit(pageMounted);

  const areClosedTasksLoading = useUnit($areClosedTasksLoading);

  const onProjectPageButtonClick = useUnit(projectPageButtonClicked);

  const searchValue = useUnit($searchValue);
  const onSearchProjectName = useUnit(searchValueChanged);

  const closedTasks = useUnit($closedTasksToShow);

  const onTaskClick = useUnit(taskClicked);

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
            Завершенные задачи
          </Text>
        </Flex>
        {areClosedTasksLoading && <Spinner marginTop="30px" />}
        {!areClosedTasksLoading && (
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
                onClick={onProjectPageButtonClick}
                textOverflow="ellipsis"
                width="33%"
                colorScheme="gray"
              >
                Назад к проекту
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
                  placeholder="Название задачи"
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
              {closedTasks.map((task) => (
                <Box
                  key={task.id}
                  cursor="pointer"
                  onClick={() => {
                    onTaskClick({ taskId: task.id });
                  }}
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
                    {task.name}
                  </Text>
                  <Text textOverflow="ellipsis" fontSize="20px">
                    {task.description}
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
