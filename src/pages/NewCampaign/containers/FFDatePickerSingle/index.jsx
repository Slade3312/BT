import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import DatePickerSingle from 'components/fields/DatePickerSingle';
import withFinalField from 'enhancers/withFinalField';
import { withError } from 'components/fields/TextInput/enhancers';

import styles from './styles.pcss';

const cx = classNames.bind({ ...styles });

const LaunchDatesError = withError('span');

const FFDatePickerSingle = (props) => {
  const [error, setError] = useState('');

  return (
    <div className={props.className}>
      <div className={cx('datepickerLine')}>
        <DatePickerSingle
          {...props}
          setError={setError}
        />

        {props.infoTextComponent && <props.infoTextComponent />}
      </div>

      <LaunchDatesError
        error={error || props.error}
        keepErrorIndent={false}
      />
    </div>
  );
};

FFDatePickerSingle.propTypes = {
  error: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  infoTextComponent: PropTypes.any,
};

export default withFinalField(withError(FFDatePickerSingle));
