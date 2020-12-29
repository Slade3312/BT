import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { compose } from 'utils/fn';
import { NestedDepthHelper, NestedContext } from './helpers';


/**
 * A higher order createReduceSelector,
 * attaches reactContext to the result of the selector
 */
export const createContextSelector = reactContext => (...args) => {
  const [combinerFn] = args.splice(-1, 1);
  const allSelectors = args;

  /**
   * The result of this part gets memorised
   * it returns the global data object along with selector context
   */
  const memorizedSelector = createSelector(
    ...allSelectors,
    (...values) => {
      const nestedMapper = NestedDepthHelper.getNestedMapper(allSelectors);
      const selectResult = nestedMapper.deepMap(values, combinerFn);

      const ancestorContexts = NestedContext.collectContext(...values);
      NestedContext.bindContext(selectResult, ancestorContexts);
      if (reactContext) NestedContext.bindContext(selectResult, reactContext);
      return selectResult;
    },
  );

  /**
   * The result of this part gets called each time selector is used,
   * in different contexts it returns different parts of data
   */
  const unpackableSelector = (state, ownProps) => {
    const unpackSelectResult = NestedContext.getDataByContextUnpacker(state);
    const originalState = NestedContext.withoutContextParser(state);
    const selectResult = memorizedSelector(originalState, ownProps);
    return unpackSelectResult(selectResult);
  };


  const maxNestingDepth = NestedDepthHelper.maxDepth(allSelectors);
  NestedDepthHelper.setDepth(unpackableSelector, maxNestingDepth);
  if (reactContext) NestedDepthHelper.incrementDepth(unpackableSelector);

  return unpackableSelector;
};


/**
 * Has exactly the same interface as `createSelector` from `reselect`
 * Differs in a way result is calculated:
 *  it takes nestedSelectors and applies combinerFn to every set of nested values
 *
 * For example: createReduceSelector(dictA, dictB, selA, selB, fn), turns into
 *   result[`id`] = createSelector(dictA[`id`], dictB[`id`], selA, selB, fn);
 */
export const createReduceSelector = createContextSelector();

export const connectNested = (contextArray, mapStateToProps, ...otherConnectArgs) => {
  const contextInjector = new NestedContext(contextArray || []);
  const contextBoundMapStateToProps = (state, ownProps) => {
    contextInjector.fillContextValues(ownProps);
    const richState = contextInjector.withContextParser(state);
    return mapStateToProps(richState, ownProps);
  };

  return compose(
    ...contextInjector.buildContextConsumers(),
    connect(contextBoundMapStateToProps, ...otherConnectArgs),
  );
};
