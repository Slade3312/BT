import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { explodeStringByRegExp, escapeStringRegexp } from 'utils/fn';
import LabelText from './LabelText';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const renderLabelWithMatching = (sourceStr, matchRegExp) => {
  const words = sourceStr.split(/\s+/);
  const lastIndex = words.length - 1;
  return words.map((word, index) => {
    const [prefix, match, postfix] = explodeStringByRegExp(word, matchRegExp);
    return (
      <React.Fragment key={word}>
        <LabelText>{prefix}</LabelText>
        {match && <LabelText isBold>{match}</LabelText>}
        <LabelText>{postfix}</LabelText>
        {index !== lastIndex && ' '}
      </React.Fragment>
    );
  });
};

const getMatchStringByOr = (matchStrings) => {
  const dividedStrings = [' ', ...matchStrings.split(/\s+/)];
  return dividedStrings.map(escapeStringRegexp).join('|^');
};

const ItemComponent = ({ value: { label }, filterText }) => {
  const matchStr = getMatchStringByOr(filterText);
  const matchRegExp = new RegExp(matchStr, 'i');
  return (
    <div className={cx('item')}>
      {renderLabelWithMatching(label, matchRegExp)}
    </div>
  );
};

ItemComponent.propTypes = {
  value: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }),
  filterText: PropTypes.string,
};

export default ItemComponent;
