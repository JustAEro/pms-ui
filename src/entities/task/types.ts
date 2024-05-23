export type TaskOnBoard = {
  id: string;
  name: string;
  description: string;
  status: DisplayedOnBoardTaskStatus;
};

export type DisplayedOnBoardTaskStatus =
  | 'Отложено'
  | 'Открыт'
  | 'В работе'
  | 'На тестировании'
  | 'На ревью';
