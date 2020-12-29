import React from 'react';
import PropTypes from 'prop-types';
import { TileCol } from '../../components';

const NameCol = ({ children }) => (
  <TileCol isLimited type={TileCol.propConstants.types.search}>
    {children}
  </TileCol>
);

NameCol.propTypes = {
  children: PropTypes.string,
};

export default NameCol;
