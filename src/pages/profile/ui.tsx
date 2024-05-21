import { useUnit } from 'effector-react';
import { FC } from 'react';

import { Box, Flex, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { $userType } from '@pms-ui/entities/user';
import { header as pageHeader } from '@pms-ui/widgets/header';

import { headerModel } from './model';

const textFontSizes = [16, 21, 30];

type Project = {
  id: string;
  name: string;
  description: string;
};

const projectsOfUser: Project[] = [
  {
    id: '1',
    name: 'Proj1',
    description: 'desc_proj_1',
  },
  {
    id: '2',
    name: 'Proj2',
    description:
      // eslint-disable-next-line max-len
      'desc_proj_2fjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkg',
  },
  {
    id: '3',
    name: 'Proj3',
    description: 'desc_proj_3',
  },
];

export const ProfilePage: FC = () => {
  const userType = useUnit($userType);

  return (
    <Box>
      <pageHeader.ui model={headerModel} />
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        fontSize="3xl"
      >
        <Text marginTop="50px" fontWeight="bold" fontSize={textFontSizes}>
          Профиль
        </Text>

        <SimpleGrid
          marginLeft={userType === 'admin' ? '130px' : '50px'}
          marginTop="40px"
          columns={2}
          spacingX={10}
          spacingY={5}
        >
          <Text fontSize="18px" fontWeight="bold">
            Логин
          </Text>
          <Text fontSize="18px">seg_fault</Text>
          <Text fontSize="18px" fontWeight="bold">
            Имя
          </Text>
          <Text fontSize="18px">Name</Text>
          <Text fontSize="18px" fontWeight="bold">
            Фамилия
          </Text>
          <Text fontSize="18px">Surname</Text>
          <Text fontSize="18px" fontWeight="bold">
            Роль
          </Text>
          <Text fontSize="18px">
            {userType === 'admin' && 'Администратор системы'}
            {userType === 'user' && 'Пользователь'}
          </Text>
        </SimpleGrid>

        {userType === 'user' && (
          <Flex direction="column" alignItems="start" justifyContent="start">
            <Text
              marginTop="50px"
              marginLeft="50px"
              fontWeight="bold"
              fontSize="18px"
              alignSelf="center"
            >
              Список проектов, в которых Вы состоите
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
                    <Text fontWeight="bold" fontSize="18px">
                      {project.name}
                    </Text>
                    <Text fontSize="18px">{project.description}</Text>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
