import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { StepLayout } from 'pages/NewCampaign/components';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const StepParamsLayout = ({ children }) => <StepLayout className={cx('container')}>{children}</StepLayout>;

StepParamsLayout.propTypes = {
  children: PropTypes.node,
};

export default StepParamsLayout;
