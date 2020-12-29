import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { SubHeadline, Heading } from 'components/layouts';
import commonStyles from 'styles/common.pcss';
import CustomPropTypes from 'utils/prop-types';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

export default function AdviceHeading({ title, description, className }) {
  return (
    <div className={className}>
      <div className={cx('header', 'padh-m')}>
        <Heading className={cx('marb-m')}>
          {title}
        </Heading>

        <SubHeadline className={cx('description', 'marb-l')}>{description}</SubHeadline>
      </div>
    </div>
  );
}

AdviceHeading.propTypes = {
  className: PropTypes.string,
  title: CustomPropTypes.templateField,
  description: CustomPropTypes.templateField,
};
