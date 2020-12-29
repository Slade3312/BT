import { OptionsFactory, OptionsList } from '../../../../../_parts';
import SingleOptionsItem from './SingleOptionsItem';

export default class Options extends OptionsFactory {
  getChildComponents = () => ({
    OptionsList,
    OptionsItem: SingleOptionsItem,
  });
}
