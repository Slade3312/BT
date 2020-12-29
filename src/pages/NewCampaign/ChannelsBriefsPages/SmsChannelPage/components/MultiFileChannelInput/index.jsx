import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { MultiFileUploadInput } from 'components/fields';
import { IconPseudoLink } from 'components/buttons';
import CustomPropTypes from 'utils/prop-types';
import { withForwardedRef } from 'enhancers';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const MultiFileChannelInput = ({
  name,
  fileLink,
  forwardedRef,
  files,
  buttonNameWithFiles,
  buttonNameWithoutFiles,
  iconButton,
  ...otherProps
}) => (
  <MultiFileUploadInput ref={forwardedRef} name={name} {...otherProps}>
    <div className={cx('button')}>
      <IconPseudoLink icon={iconButton}>
        {files.length > 0 ? buttonNameWithFiles : buttonNameWithoutFiles}
      </IconPseudoLink>
    </div>
  </MultiFileUploadInput>
);

MultiFileChannelInput.propTypes = {
  fileName: PropTypes.string,
  forwardedRef: PropTypes.shape({ current: PropTypes.object }),
  name: PropTypes.string,
  fileLink: PropTypes.string,
  files: PropTypes.array,
  buttonNameWithFiles: PropTypes.string,
  buttonNameWithoutFiles: PropTypes.string,
  iconButton: CustomPropTypes.templateField,
};

export default withForwardedRef(MultiFileChannelInput);
