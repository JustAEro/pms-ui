import { counterFactory } from './model';
import { Counter } from './ui';

export const counter = {
  model: counterFactory,
  ui: Counter,
};
