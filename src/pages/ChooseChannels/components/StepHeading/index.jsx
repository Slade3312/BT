import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import commonStyles from 'styles/common.pcss';

import { ExoticHeading, Heading } from 'components/layouts';

const cx = classNames.bind(commonStyles);

function StepHeading({ title, description, className, titleClassName }) {
  return (
    <div className={className}>
      <ExoticHeading level={2} className={cx('marb-m', titleClassName)}>{title}</ExoticHeading>

      <Heading level={5}>{description}</Heading>
    </div>
  );
}

StepHeading.propTypes = {
  title: PropTypes.node,
  description: PropTypes.node,
  className: PropTypes.string,
  titleClassName: PropTypes.string,
};

export default StepHeading;
