import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { useFormState } from 'react-final-form';
import commonStyles from 'styles/common.pcss';
import { formatDate } from 'utils/date';
import { ORDER_DATE } from 'store/NewCampaign/channels/constants';
import FFDatePicker from 'pages/NewCampaign/containers/FFDatePicker';
import { InfoText } from 'pages/NewCampaign/ChannelsBriefsPages/components';
import { DateValidatorsContext } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/channelsContext';

import FieldLabel from '../FieldLabel';
import { useNormalizedInternetFields } from '../../hooks/use-normalized-internet-fields';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

const infoTextComponent = () => (
  <InfoText className={cx('infoText')}>
    Рекламная кампания будет длиться 30 дней.
  </InfoText>
);

function NewLaunchDates({ className }) {
  const { values } = useFormState();
  const { date } = useNormalizedInternetFields();
  const {
    countMinStartDate,
    countMaxStartDate,
    countMinEndDate,
    countMaxEndDate,
    isWeekendDisabled,
    isEndDisabled,
    holidays,
  } = useContext(DateValidatorsContext);

  return (
    <div className={cx('fieldRow', className)}>
      <FieldLabel
        text={date.label}
      />

      <FFDatePicker
        name={ORDER_DATE}
        className={cx('datepicker')}
        onChangeProxy={formatDate}

        minStart={countMinStartDate()}
        maxStart={countMaxStartDate()}
        minEnd={countMinEndDate(values?.date_start ? values.date_start[0] : null)}
        maxEnd={countMaxEndDate(values?.date_start ? values.date_start[0] : null)}
        isWeekendDisabled={isWeekendDisabled}
        isEndDisabled={isEndDisabled}

        countMinEnd={countMinEndDate}
        countMaxStart={countMaxStartDate}
        countMaxEnd={countMaxEndDate}
        holidays={holidays}
        infoTextComponent={infoTextComponent}
      />
    </div>
  );
}

NewLaunchDates.propTypes = {
  className: PropTypes.string,
};

export default NewLaunchDates;
