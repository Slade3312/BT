import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { IconLink } from 'components/buttons';
import { explodeStringByRegExp } from 'utils/fn';
import { downloadTxtFile } from 'utils/router';
import { STATIC_LINKS } from '../../constants';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export const textMapperConfig = [
  { pattern: '.csv', href: STATIC_LINKS.EXAMPLE_CSV },
  { pattern: '.txt', href: STATIC_LINKS.EXAMPLE_TXT },
  { pattern: '.xlsx', href: STATIC_LINKS.EXAMPLE_XLSX },
];

// process text by regExp patterns and put download button after matched elements with config props
export default function ProcessInfoText({ children: text }) {
  let resultsMatched = [];
  let curPrefix = text;
  textMapperConfig.forEach(({ pattern, href }) => {
    const [prefix, matched, postfix] = explodeStringByRegExp(curPrefix, new RegExp(pattern));
    curPrefix = postfix;
    resultsMatched = [
      ...resultsMatched,
      <span key={prefix}>{prefix}</span>,
      matched && (
        <div key={matched} className={cx('buttonContent')}>
          <span className={cx('format')}>{matched}</span>

          <IconLink
            target="_blank"
            className={cx('button')}
            href={href}
            onClick={matched === '.txt'
              ? (e) => {
                e.preventDefault();
                downloadTxtFile(href);
              } : null
            }
            isCompact
          >
            скачать
          </IconLink>
        </div>
      ),
    ];
  });
  return resultsMatched;
}

ProcessInfoText.propTypes = {
  children: PropTypes.node,
};
