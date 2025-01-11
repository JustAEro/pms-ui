import { CreateStyled } from '@emotion/styled';

export const transientOptions: Parameters<CreateStyled>[1] = {
  shouldForwardProp: (propName: string) => !propName.startsWith('$'),
};

export async function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export function truncateString(str: string, maxLength: number) {
  if (str.length > maxLength) {
    return `${str.slice(0, maxLength - 3)}...`;
  }

  return str;
}
