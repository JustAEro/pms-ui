import { useUnit } from 'effector-react';
import React, { FC } from 'react';

import { Flex, Input, ListItem, Text, UnorderedList } from '@chakra-ui/react';

import { $files, filesChanged } from './model';

export const FileUploader: FC = () => {
  const files = useUnit($files);
  const onFilesChange = useUnit(filesChanged);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesChange([...e.target.files]);
    }
  };

  return (
    <>
      <Input width="70%" type="file" multiple onChange={handleFileChange} />
      <Flex direction="column" alignItems="start">
        {files &&
          files.map((file, index) => (
            <section key={file.name} style={{ marginTop: '10px' }}>
              <Text fontSize={22}> Файл {index + 1}: </Text>
              <UnorderedList styleType="'-'">
                <ListItem>
                  <Text fontSize={20}>
                    Имя: <strong>{file.name}</strong>
                  </Text>
                </ListItem>
                <ListItem>
                  <Text fontSize={20}>
                    Размер:{' '}
                    <strong>{(file.size / 1024).toFixed(2)} КБайт</strong>
                  </Text>
                </ListItem>
              </UnorderedList>
            </section>
          ))}
      </Flex>
    </>
  );
};
