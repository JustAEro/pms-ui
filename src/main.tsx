import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'effector-react';
import { fork } from 'effector';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';

import App from './app/app';
import theme from './shared/ui/theme/theme';

const container = document.getElementById('app');
const root = createRoot(container as HTMLElement);
const scope = fork();

root.render(
  <StrictMode>
    <Provider value={scope}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </ChakraProvider>
    </Provider>
  </StrictMode>
);
