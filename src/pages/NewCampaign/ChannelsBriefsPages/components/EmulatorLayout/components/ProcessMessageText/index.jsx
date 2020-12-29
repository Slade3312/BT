import React, { memo } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { escapeStringRegexp, explodeStringByRegExp } from 'utils/fn';
import { messageUrlRegExp, phoneRegExp, uglyUrlRegExp } from 'utils/regexps';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const regExpUrlOrPhone = new RegExp(`${phoneRegExp.source}|${messageUrlRegExp.source}|${uglyUrlRegExp.source}`, 'gi');

function ProcessMessageText({ children: text }) {
  let lastPostFix = text;
  const matchedLinks = text.match(regExpUrlOrPhone) || [];

  const result = matchedLinks.reduce((acc, curUrl, index, arr) => {
    const [prefix, curMatched, postfix] = explodeStringByRegExp(lastPostFix, escapeStringRegexp(curUrl));

    const stepResult = [prefix];

    if (curMatched) {
      const key = `${curUrl}-${index}`;
      stepResult.push(<span key={key} className={cx('link')}>{curUrl}</span>);
    }

    if (index === arr.length - 1 && postfix) {
      stepResult.push(postfix);
    }

    lastPostFix = postfix;

    return [...acc, ...stepResult];
  }, []);

  return <div className={styles.wrapper}>{result.length > 0 ? result : text}</div>;
}

ProcessMessageText.propTypes = {
  children: PropTypes.node,
};

export default memo(ProcessMessageText);
