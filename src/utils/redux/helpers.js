import { map, filter, flatten, distinct, isPlainObject, passAsIs } from 'utils/fn';
import { withContext } from 'utils/context';

export class NestedDepthHelper {
  static __depthKey = '__REDUCE_SELECTOR_NESTED_DEPTH';

  static getDepth(selector) { return selector[this.__depthKey] || 0; }
  static setDepth(selector, value) { selector[this.__depthKey] = value; }
  static incrementDepth(selector) { this.setDepth(selector, this.getDepth(selector) + 1); }
  static maxDepth(selectors) { return Math.max(...this.getDepthArray(selectors)); }
  static getDepthArray(selectors) { return selectors.map(item => this.getDepth(item)); }

  static getNestedMapper(selectors) { return new NestedMapper(this.getDepthArray(selectors)); }
}

export class NestedContext {
  static __contextKey = '__REDUCE_SELECTOR_CONTEXT_STACK';
  static __contextParserKey = '__unpackDataByContext';

  static getContextStack(resultDict) {
    return isPlainObject(resultDict) && resultDict[this.__contextKey] || [];
  }
  static bindContext(resultDict, reactContexts) {
    resultDict[this.__contextKey] = [
      ...this.getContextStack(resultDict),
      ...Array.isArray(reactContexts) ? reactContexts : [reactContexts],
    ];
  }

  static getDataByContextUnpacker(obj) {
    return isPlainObject(obj) && obj[this.__contextParserKey] || passAsIs;
  }

  static isReservedKey(key) { return key === this.__contextKey; }

  // TODO: isPlainObject check came out as a bugfix, should reconsider whether there is a better solution
  static skipReservedKeys(resultDict) {
    if (isPlainObject(resultDict)) return filter(resultDict, (_, key) => !this.isReservedKey(key));
    return resultDict;
  }

  static collectContext(...resultDicts) {
    const contextGroups = resultDicts.map(item => NestedContext.getContextStack(item));
    const contextArray = flatten(contextGroups);
    return distinct(contextArray);
  }

  static withoutContextParser({ [NestedContext.__contextParserKey]: contextParser, ...rawState }) {
    return rawState;
  }

  constructor(contextArray) {
    this._contextArray = contextArray;
    this._contextPropNameArray = contextArray.map((_, index) => `__nestedContextAt${index}`);
    this._contextValueArray = undefined;
  }

  buildContextConsumers = () => this._contextArray
    .map((context, key) => withContext(context, value => ({
      [this._contextPropNameArray[key]]: value,
    })));

  fillContextValues = (props) => {
    this._contextValueArray = this._contextPropNameArray.map(propName => props[propName]);
  };

  withContextParser(state) {
    return {
      ...state,
      [NestedContext.__contextParserKey]: this.unpackDataByContext,
    };
  }

  getContextValue = (Context) => {
    this._assertContextValueFilled();
    const contextIndex = this._contextArray.indexOf(Context);
    console.assert(contextIndex !== -1, 'Missing context required to parse selector');

    return this._contextValueArray[contextIndex];
  };

  unpackDataByContext = (resultDict) => {
    this._assertContextValueFilled();

    const contextStack = NestedContext.getContextStack(resultDict);

    return contextStack.reduce((result, Context) => {
      if (isPlainObject(result)) {
        const contextValue = this.getContextValue(Context);
        return result[contextValue];
      }
      console.warn('updateDateByContext result is not an object');
      return null;
    }, resultDict);
  };

  _assertContextValueFilled = () => console.assert(
    typeof this._contextValueArray !== 'undefined',
    'Attempting to use context before value has been filled',
  );
}


/**
 * A Support class to deeply map list of differently nested values
 */
class NestedMapper {
  constructor(depthArray) {
    this._depthArray = depthArray;
    this._maxDepth = Math.max(...depthArray);
    this._maxDepthIndex = depthArray.indexOf(this._maxDepth);
    this._depth = 0;
  }

  deepMap(values, callback) {
    if (this._depth === this._maxDepth) return callback(...values);

    if (this._depth === 0) {
      values = values.map(val => NestedContext.skipReservedKeys(val));
    }

    this._depth += 1;
    const mappedValue = map(
      values[this._maxDepthIndex],
      (_, key) => this.deepMap(this._getNextValues(values, key), callback),
    );
    this._depth -= 1;

    return mappedValue;
  }

  /** return value `by key` for nested values, or `as is` for plain value */
  _getNextValues(values, nextKey) {
    return values.map((value, valueIndex) => (
      this._depth <= this._depthArray[valueIndex] ? value[nextKey] : value
    ));
  }
}
