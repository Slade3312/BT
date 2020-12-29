import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from 'components/layouts';

export default function TitlePart({ children, className }) {
  return (
    <Heading level={3} className={className}>
      {children}
    </Heading>
  );
}

TitlePart.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
