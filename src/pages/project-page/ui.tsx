import { useUnit } from 'effector-react';
import { FC } from 'react';

import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { header as pageHeader } from '@pms-ui/widgets/header';

import { $isProjectLoading, $project, headerModel } from './model';

const textFontSizes = [16, 21, 30];

export const ProjectPage: FC = () => {
  const isProjectLoading = useUnit($isProjectLoading);
  const project = useUnit($project);

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
        {!isProjectLoading && project && (
          <Flex
            marginTop="30px"
            direction="row"
            alignItems="baseline"
            gap="20px"
          >
            <Text fontWeight="bold" fontSize={textFontSizes}>
              Доска проекта {project.name}
            </Text>
            {/* <div style={{ marginBottom: '10px' }}>
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
            </div> */}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
