import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames/bind';
import ActionButton from '../../buttons/ActionButtons/ActionButton';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

function PaginatorLayout({ onClick, nextCount, className, isLoading }) {
  return (
    <div className={cx('content', className)}>
      {!isLoading && (
        <ActionButton
          iconSlug="arrowRightMinimal"
          className={cx('button')}
          onClick={onClick}
        >
          Показать ещё ({nextCount})
        </ActionButton>
      )}
    </div>
  );
}

PaginatorLayout.propTypes = {
  onClick: PropTypes.func,
  nextCount: PropTypes.number,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default PaginatorLayout;
