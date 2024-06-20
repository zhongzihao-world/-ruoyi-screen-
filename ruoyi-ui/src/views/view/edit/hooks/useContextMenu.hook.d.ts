import { MenuEnum } from '@/enums/editPageEnum';

export interface MenuOptionsItemType {
  type?: string;
  label?: string;
  key: MenuEnum | string;
  icon?: string;
  fnHandle?: Function;
  disabled?: boolean;
  hidden?: boolean;
}
