import React, { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { DateRangePicker } from 'react-dates';
import IMask from 'imask';

const START_NOT_VALID_MESSAGE = 'Выберите доступную дату старта из календаря';
const END_NOT_VALID_MESSAGE = 'Дата завершения не валидна';
const START_REQUIRED = 'Дата старта обязательное поле';
const END_REQUIRED = 'Дата завершения обязательное поле';
const PLACEHOLDER = 'дд.мм.гггг';
const DATE_FORMAT_FOR_CONVERSIONS = 'MM/DD/YYYY';

const createImgAndInit = (input, width) => {
  const img = document.createElement('img');
  img.src = 'https://static.beeline.ru/upload/images/marketing/icons/Calendar.svg';
  img.style.position = 'absolute';
  img.style.top = '8px';
  width ? img.style.right = '10px' : img.style.left = '101px';
  img.style.cursor = 'pointer';
  img.addEventListener('click', () => {
    input.focus();
  });

  input?.parentElement.appendChild(img);
};

function DatePicker(props) {
  const { value, name } = props;
  const [focusedInput, setFocusedInput] = useState(null);
  const [inputs, setInputs] = useState([]);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const wrapperRef = useRef();

  useEffect(() => {
    setStartDate(value && value[0] ? moment(value[0]).startOf('day') : undefined);
    setEndDate(value && value[1] ? moment(value[1]).startOf('day') : undefined);
  }, [value?.[0], value?.[1]]);

  useEffect(() => {
    if (startDate && endDate) {
      props.setError(null);
    }
  }, [startDate, endDate]);

  const handleDatesChange = ({ startDate: newStartDate, endDate: newEndDate }) => {
    if ((newStartDate && !newStartDate._isValid) || (newEndDate && !newEndDate._isValid)) {
      return;
    }

    if (newStartDate && handleIsDayBlocked(newStartDate)) {
      props.setError(START_NOT_VALID_MESSAGE);
      return;
    }
    if (newEndDate && handleIsDayBlocked(newEndDate)) {
      props.setError(END_NOT_VALID_MESSAGE);
      return;
    }

    if (newStartDate && newStartDate.isBefore(props.minStart)) {
      newStartDate = moment(props.minStart);
    }
    if (newEndDate && newEndDate.isAfter(props.maxEnd)) {
      newEndDate = moment(props.maxEnd);
    }

    const isStartDateNotNull = focusedInput === 'startDate' && newStartDate !== null;
    const isEndDateNotNull = focusedInput === 'endDate' && newEndDate !== null;

    if (isStartDateNotNull || isEndDateNotNull) {
      props.setError('');
    }

    if (newStartDate) {
      // eslint-disable-next-line max-len
      if ((focusedInput === 'startDate' && (!newEndDate || moment(newEndDate).isSameOrBefore(newStartDate))) || props.isEndDisabled) {
        const minEnd = moment(props.countMinEnd(newStartDate.format(DATE_FORMAT_FOR_CONVERSIONS)));

        props.onChange([newStartDate, minEnd]);
        setStartDate(newStartDate);
        setEndDate(minEnd);
        return;
      }
    }

    if (newEndDate) {
      if (!newStartDate && focusedInput === 'endDate') {
        const maxStart = moment(props.countMaxStart(newEndDate.format(DATE_FORMAT_FOR_CONVERSIONS)));

        props.onChange([maxStart, newEndDate]);
        setStartDate(maxStart);
        setEndDate(newEndDate);
        return;
      }
    }

    props.onChange([newStartDate, newEndDate]);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const isOutsideRange = (day) => {
    day = day.startOf('day');

    const minStart = moment(props.minStart).startOf('day');
    const maxStart = moment(props.maxStart).startOf('day');
    const minEnd = moment(props.minEnd).startOf('day');
    const maxEnd = moment(props.maxEnd).startOf('day');

    if (focusedInput === 'startDate') {
      if (day.isBefore(minStart)) {
        return true;
      }
      if (day.isAfter(maxStart)) {
        return true;
      }
    }

    if (focusedInput === 'endDate') {
      if (day.isBefore(minEnd)) {
        return true;
      }
      if (day.isAfter(maxEnd)) {
        return true;
      }
    }
    return false;
  };

  const handleFocusChange = (newFocusedInput) => {
    if (props.isEndDisabled && newFocusedInput !== null) {
      setFocusedInput('startDate');
      return;
    }
    setFocusedInput(newFocusedInput);
  };

  const handleIsDayBlocked = (day) => {
    const currentDay = day.format('YYYY-MM-DD').substring(0, 10);

    return (
      props.holidays && props.holidays[currentDay]) || (props.isWeekendDisabled && (day.day() === 0 || day.day() === 6)
    );
  };

  const setNewValueIfDateIsValid = useCallback((newValue, errorMessage, isStart) => {
    const inputDateArray = newValue.split('.');
    const dateObject = moment(`${inputDateArray[2]}-${inputDateArray[1]}-${inputDateArray[0]}`);

    if (dateObject._isValid) {
      const isDayOutsideRange = isOutsideRange(dateObject);

      const isDayBlocked = handleIsDayBlocked(dateObject);

      const newStartDate = isStart ? dateObject : startDate;
      const newEndDate = isStart ? endDate : dateObject;

      if (isDayOutsideRange || isDayBlocked) {
        props.setError(errorMessage);
        props.onChange([newStartDate, newEndDate]);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        return;
      }

      if (isStart) {
        if (!newEndDate || moment(newEndDate).isSameOrBefore(newStartDate) || props.isEndDisabled) {
          const minEnd = moment(props.countMinEnd(newStartDate.format(DATE_FORMAT_FOR_CONVERSIONS)));

          if (newStartDate.isBefore(moment(props.minStart).startOf('day'))) {
            props.setError(START_NOT_VALID_MESSAGE);
            props.onChange([newStartDate, null]);
            setStartDate(newStartDate);
            setEndDate(null);
            return;
          }

          props.onChange([newStartDate, minEnd]);
          setStartDate(newStartDate);
          setEndDate(minEnd);
          props.setError('');
          return;
        }
      } else if (!newStartDate || moment(newStartDate).isSameOrAfter(newEndDate)) {
        const maxStart = moment(props.countMaxStart(newEndDate.format(DATE_FORMAT_FOR_CONVERSIONS)));

        if (maxStart.isAfter(moment(props.minStart))) {
          props.setError(END_NOT_VALID_MESSAGE);
        }

        props.onChange([maxStart, newEndDate]);
        setStartDate(maxStart);
        setEndDate(newEndDate);
        props.setError('');
        return;
      }

      const maxEnd = moment(props.countMaxEnd(newStartDate.format(DATE_FORMAT_FOR_CONVERSIONS)));

      if (newEndDate.isAfter(maxEnd)) {
        props.setError(END_NOT_VALID_MESSAGE);
      } else {
        props.setError('');
      }

      props.onChange([newStartDate, newEndDate]);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    }
  }, [focusedInput]);

  const handleStartDateInputChange = (event) => {
    if (event.target.value.length === 10) {
      setNewValueIfDateIsValid(event.target.value, START_NOT_VALID_MESSAGE, true);
    }
  };

  const handleEndDateInputChange = (event) => {
    if (event.target.value.length === 10) {
      setNewValueIfDateIsValid(event.target.value, END_NOT_VALID_MESSAGE, false);
    }
  };

  const handleCalendarClose = () => {
    if (!endDate) {
      props.setError(END_REQUIRED);
    }
    if (!startDate) {
      props.setError(START_REQUIRED);
    }
    if (inputs[1].value && inputs[1].value.length !== 10) {
      props.setError(END_NOT_VALID_MESSAGE);
    }
    if (inputs[0].value && inputs[0].value.length !== 10) {
      props.setError(START_NOT_VALID_MESSAGE);
    }
  };

  useEffect(() => {
    const inputsCollection = wrapperRef.current.getElementsByClassName('DateInput_input');
    const input = inputsCollection[0];
    const input2 = inputsCollection[1];

    setInputs([input, input2]);
    try {
      if (props.width && input) {
        const element = document.querySelectorAll('.DateInput')[props.numberInCollection || 0];
        element.style.width = `${props.width}px`;
      }
    } catch (e) {
      console.log(e);
    }

    createImgAndInit(input, props.width);
    createImgAndInit(input2);

    if (props.isEndDisabled) {
      input2.parentElement.style.display = 'none';
    }

    IMask(input, {
      mask: Date,
    });

    IMask(input2, {
      mask: Date,
    });

    input.addEventListener('input', handleStartDateInputChange);
    input2.addEventListener('input', handleEndDateInputChange);

    return () => {
      input.removeEventListener('input', handleStartDateInputChange);
      input2.removeEventListener('input', handleEndDateInputChange);
    };
  }, []);

  return (
    <div ref={wrapperRef} name={name}>
      <DateRangePicker
        startDate={startDate}
        startDateId="start_date_id"
        endDate={endDate}
        endDateId="end_date_id"
        onDatesChange={(values) => {
          handleDatesChange({ startDate: values.startDate, endDate: values.endDate });
        }}
        focusedInput={focusedInput}
        onFocusChange={handleFocusChange}
        displayFormat="DD.MM.YYYY"
        hideKeyboardShortcutsPanel
        numberOfMonths={props.numberOfMonths || 2}
        block={false}
        small={false}
        withFullScreenPortal={false}
        anchorDirection="left"
        orientation="horizontal"
        startDatePlaceholderText={props.startDatePlaceholder || PLACEHOLDER}
        endDatePlaceholderText={props.endDatePlaceholder || PLACEHOLDER}
        minimumNights={0}
        isDayBlocked={handleIsDayBlocked}
        firstDayOfWeek={1}
        isOutsideRange={isOutsideRange}
        onClose={handleCalendarClose}
        readOnly={props.isInputsReadOnly}
      />
    </div>
  );
}

DatePicker.propTypes = {
  value: PropTypes.any,
  name: PropTypes.string,
  onChange: PropTypes.func,
  isWeekendDisabled: PropTypes.bool,
  holidays: PropTypes.object,
  minStart: PropTypes.object,
  maxStart: PropTypes.object,
  minEnd: PropTypes.object,
  maxEnd: PropTypes.object,
  setError: PropTypes.func,
  countMinEnd: PropTypes.func,
  countMaxEnd: PropTypes.func,
  countMaxStart: PropTypes.func,
  isEndDisabled: PropTypes.bool,
  numberOfMonths: PropTypes.any,
  width: PropTypes.any,
  numberInCollection: PropTypes.any,
  endDatePlaceholder: PropTypes.any,
  startDatePlaceholder: PropTypes.any,
  isInputsReadOnly: PropTypes.bool,
};

export default DatePicker;
