import { DisplayedOnBoardTaskStatus } from './types';

export const taskStatuses = [
  'Отложено',
  'Открыт',
  'В работе',
  'На тестировании',
  'На ревью',
  'Закрыт',
  'Архив',
] as const;

export const taskStatusesNotShownOnBoard = ['Закрыт', 'Архив'] as const;

export const columnNames: DisplayedOnBoardTaskStatus[] = [
  'Отложено',
  'Открыт',
  'В работе',
  'На тестировании',
  'На ревью',
];

export const columnKeyAcceptsFromStatusesValue: Record<
  DisplayedOnBoardTaskStatus,
  DisplayedOnBoardTaskStatus[]
> = {
  // eslint-disable-next-line prettier/prettier
  Отложено: ['Открыт', 'В работе', 'На тестировании', 'На ревью'],
  // eslint-disable-next-line prettier/prettier
  Открыт: ['Отложено'],
  'В работе': ['Открыт', 'На ревью', 'На тестировании'],
  'На тестировании': ['В работе'],
  'На ревью': ['В работе', 'На тестировании'],
};

export const statusKeyCanGoToColumnsValue: Record<
  DisplayedOnBoardTaskStatus,
  DisplayedOnBoardTaskStatus[]
> = {
  // eslint-disable-next-line prettier/prettier
  Отложено: ['Открыт'],
  // eslint-disable-next-line prettier/prettier
  Открыт: ['В работе', 'Отложено'],
  'В работе': ['Отложено', 'На тестировании', 'На ревью'],
  'На тестировании': ['Отложено', 'В работе', 'На ревью'],
  'На ревью': ['В работе', 'Отложено'],
};
