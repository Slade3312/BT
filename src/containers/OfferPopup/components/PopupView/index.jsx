import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Heading } from 'components/layouts';
import { PopupStateless } from 'components/common';

import commonStyles from 'styles/common.pcss';
import { OverlayLoader } from 'components/common/Loaders/components';

import OfferForm from 'components/forms/OfferForm';

import styles from './styles.pcss';

const cx = classNames.bind({ ...styles, ...commonStyles });

export default function OfferPopupView({ title, description, isLoading, buttonText, labelText, onSubmit }) {
  return (
    <PopupStateless
      opened
      onClose={() => {}}
      hideCloseButton
      className={cx('content')}
    >
      <OverlayLoader isLoading={isLoading}>
        <Heading level={2} className={cx('marb-m')}>
          {title}
        </Heading>

        <Heading level={4} className={cx('marb-xs')}>
          {description}
        </Heading>

        <OfferForm
          labelText={labelText}
          buttonText={buttonText}
          onSubmit={onSubmit}
        />
      </OverlayLoader>
    </PopupStateless>
  );
}

OfferPopupView.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  labelText: PropTypes.string,
  onSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
};
