import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useFormState } from 'react-final-form';
import { useSelector } from 'react-redux';
import { formatDate } from 'utils/date';
import { ORDER_DATE } from 'store/NewCampaign/channels/constants';
import FFDatePicker from 'pages/NewCampaign/containers/FFDatePicker';
import { getHolidays } from 'store/settings/selectors';
import styles from './styles.pcss';

export default function NewLaunchDates({
  countMinStartDate,
  countMaxStartDate,
  countMinEndDate,
  countMaxEndDate,
  isWeekendDisabled,
  isEndDisabled,
  className,
}) {
  const { values } = useFormState();
  const holidays = useSelector(getHolidays);
  return (
    <FFDatePicker
      name={ORDER_DATE}
      className={classNames(styles.datepicker, className)}
      onChangeProxy={formatDate}
      minStart={countMinStartDate()}
      maxStart={countMaxStartDate()}
      minEnd={countMinEndDate(values?.date ? values.date[0] : null)}
      maxEnd={countMaxEndDate(values?.date ? values.date[0] : null)}
      isWeekendDisabled={isWeekendDisabled}
      isEndDisabled={isEndDisabled}
      countMinEnd={countMinEndDate}
      countMaxStart={countMaxStartDate}
      countMaxEnd={countMaxEndDate}
      holidays={holidays}
    />
  );
}

NewLaunchDates.propTypes = {
  countMinStartDate: PropTypes.func,
  countMaxStartDate: PropTypes.func,
  countMinEndDate: PropTypes.func,
  countMaxEndDate: PropTypes.func,
  isWeekendDisabled: PropTypes.bool,
  isEndDisabled: PropTypes.bool,
  className: PropTypes.string,
};
