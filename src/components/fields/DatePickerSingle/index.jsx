import React, { useState, useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { SingleDatePicker } from 'react-dates';
import GlobalIcon from 'components/common/GlobalIcon';
import styles from './styles.pcss';

const DatePickerSingle = props => {
  const [isFocused, setFocused] = useState(false);
  const handleIsDayBlocked = (day) => {
    const currentDay = day.format('YYYY-MM-DD').substring(0, 10);

    return (
      props.holidays && props.holidays[currentDay]) || (props.isWeekendDisabled && (day.day() === 0 || day.day() === 6)
    );
  };
  useEffect(() => {
    const elements = document.querySelectorAll('.DateInput');
    Array.from(elements).forEach(item => { item.style.margin = '0'; });
  }, []);
  return (
    <div className={styles.holder}>
      <SingleDatePicker
        date={props.value ? moment(props.value) : null}
        onDateChange={date => {
            props.onChange(date);
        }}
        focused={isFocused}
        onFocusChange={({ focused }) => setFocused(focused)}
        id={props.name}
        name={props.name}
        noBorder={props.noBorder}
        openDirection={props.openDirection}
        disabled={props.disabled}
        displayFormat="DD.MM.YYYY"
        // eslint-disable-next-line consistent-return
        isOutsideRange={ day => {
          day = day.startOf('day');
          const minStart = moment(props.startDate).startOf('day');

          if (props.startDate) {
            return day.isBefore(minStart);
          }
        }}
        isDayBlocked={handleIsDayBlocked}
        placeholder={props.placeholder}
        hideKeyboardShortcutsPanel
        numberOfMonths={1}
        firstDayOfWeek={1}
    />
      <span className={styles.icon} onClick={() => {
        !props.disabled && setFocused(true);
      }}>
        <GlobalIcon slug="calendarIcon"/>
      </span>
    </div>
  );
};

DatePickerSingle.propTypes = {
  onChange: PropTypes.func,
  noBorder: PropTypes.bool,
  placeholder: PropTypes.string,
  startDate: PropTypes.any,
  disabled: PropTypes.any,
  value: PropTypes.any,
  openDirection: PropTypes.any,
  isWeekendDisabled: PropTypes.bool,
  holidays: PropTypes.object,
  name: PropTypes.string,
};

export default DatePickerSingle;
