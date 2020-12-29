import React from 'react';
import { phoneMask } from 'constants/masks';
import TextViewer from '../views/TextViewer';
import withMask from '../enhancers/withMask';

const MaskedText = withMask(TextViewer);

export default props => (
  <MaskedText
    type="tel"
    mask={phoneMask}
    unmaskValue={() => null}
    {...props}
  />
);
