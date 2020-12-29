import { OptionsFactory } from '../../../_parts';
import OptionsItem from './OptionsItem';
import OptionsList from './OptionsList';

export default class MultiOptions extends OptionsFactory {
  getChildComponents = () => ({
    OptionsList,
    OptionsItem,
  });
}

MultiOptions.defaultProps = {
  isMulti: true,
};
