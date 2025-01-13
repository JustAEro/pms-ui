import { OptionBase } from 'chakra-react-select';

export interface UserOption extends OptionBase {
  label: string;
  value: string;
  userId: string;
}
