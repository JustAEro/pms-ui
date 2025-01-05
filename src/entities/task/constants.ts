import { DisplayedOnBoardTaskStatus } from './types';

export const taskStatuses = [
  'Отложено',
  'Открыта',
  'В работе',
  'На тестировании',
  'На ревью',
  'Закрыт',
  'Архив',
] as const;

export const taskStatusesNotShownOnBoard = ['Закрыт', 'Архив'] as const;

export const columnNames: DisplayedOnBoardTaskStatus[] = [
  'Отложено',
  'Открыта',
  'В работе',
  'На тестировании',
  'На ревью',
];

export const columnKeyAcceptsFromStatusesValue: Record<
  DisplayedOnBoardTaskStatus,
  DisplayedOnBoardTaskStatus[]
> = {
  // eslint-disable-next-line prettier/prettier
  Отложено: ['Открыта', 'В работе', 'На тестировании', 'На ревью'],
  // eslint-disable-next-line prettier/prettier
  Открыта: ['Отложено'],
  'В работе': ['Открыта', 'На ревью', 'На тестировании'],
  'На тестировании': ['В работе'],
  'На ревью': ['В работе', 'На тестировании'],
};

export const statusKeyCanGoToColumnsValue: Record<
  DisplayedOnBoardTaskStatus,
  DisplayedOnBoardTaskStatus[]
> = {
  // eslint-disable-next-line prettier/prettier
  Отложено: ['Открыта'],
  // eslint-disable-next-line prettier/prettier
  Открыта: ['В работе', 'Отложено'],
  'В работе': ['Отложено', 'На тестировании', 'На ревью'],
  'На тестировании': ['Отложено', 'В работе', 'На ревью'],
  'На ревью': ['В работе', 'Отложено'],
};
