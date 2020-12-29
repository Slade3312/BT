import { OptionsFactory, OptionsList } from '../../../../../_parts';
import MultiOptionsItem from './MultiOptionsItem';

export default class MultiOptions extends OptionsFactory {
  getChildComponents = () => ({
    OptionsList,
    OptionsItem: MultiOptionsItem,
  });
}

MultiOptions.defaultProps = {
  isMulti: true,
};
