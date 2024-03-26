import { Link } from 'atomic-router-react';
import { motion } from 'framer-motion';
import { FC } from 'react';

import {
  Box,
  Flex,
  Image,
  Link as LinkComponent,
  Text,
} from '@chakra-ui/react';
import { routes } from '@pms-ui/shared/routes';
import { counter, ThemeToggleButton } from '@pms-ui/shared/ui';
import logo from '@pms-ui/shared/ui/assets/svg/logo.svg';

import { counterModel } from './model';

const textFontSizes = [16, 18, 24, 30];

export const HomePage: FC = () => (
  <Box>
    <Flex
      as="header"
      direction="column"
      alignItems="center"
      justifyContent="center"
      h="100vh"
      fontSize="3xl"
    >
      <motion.div
        animate={{ rotateZ: 360 }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: 'linear',
        }}
      >
        <Image src={logo} alt="" h="40vmin" />
      </motion.div>
      <Text fontSize={textFontSizes}>Home Page!</Text>
      <counter.ui model={counterModel} textFontSizes={textFontSizes} />
      <Text fontSize={textFontSizes}>
        <LinkComponent color="#61dafb">
          <Link to={routes.loginRoute}>Login</Link>
        </LinkComponent>
      </Text>
    </Flex>
    <ThemeToggleButton pos="fixed" bottom="2" right="2" />
  </Box>
);
