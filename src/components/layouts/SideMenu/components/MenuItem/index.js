import classNames from 'classnames/bind';

import { defineProps } from 'utils/decorators';
import MenuItemView from './MenuItemView';
import subItemStyles from './subItemStyles.pcss';
import stepStyles from './styles.pcss';

export const MenuItem = defineProps({ cx: classNames.bind(stepStyles) })(MenuItemView);
export const MenuSubItem = defineProps({ cx: classNames.bind(subItemStyles) })(MenuItemView);
