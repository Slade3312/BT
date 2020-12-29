import React from 'react';
import PropTypes from 'prop-types';
import { TileCol } from '../../components';

const StatusCol = ({ children }) => (
  <TileCol>
    {children}
  </TileCol>
);

StatusCol.propTypes = {
  children: PropTypes.string,
};

export default StatusCol;
