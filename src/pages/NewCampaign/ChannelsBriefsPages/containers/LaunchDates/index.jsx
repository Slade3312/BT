import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';

import { useFormState } from 'react-final-form';
import moment from 'moment';
import commonStyles from 'styles/common.pcss';
import { formatDate } from 'utils/date';
import { ORDER_DATE } from 'store/NewCampaign/channels/constants';
import { DateValidatorsContext } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/channelsContext';
import FFDatePicker from 'pages/NewCampaign/containers/FFDatePicker';
import FormFieldLabel from 'components/forms/FormFieldLabel';
import InfoText from 'pages/NewCampaign/ChannelsBriefsPages/components/InfoText';

import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

function LaunchDates({
  title,
  tooltip,
  startLabel,
  endLabel,
  className,
  infoText,
}) {
  const { values } = useFormState();
  const {
    countMinStartDate,
    countMaxStartDate,
    countMinEndDate,
    countMaxEndDate,
    isWeekendDisabled,
    isEndDisabled,
    holidays,
    isInputsReadOnly,
  } = useContext(DateValidatorsContext);

  return (
    <div className={cx('component', className)}>
      <FormFieldLabel
        isBold
        className={cx('label-group-marg')}
        tooltip={tooltip}
      >
        {title}
      </FormFieldLabel>

      <div className={cx('labelsContainer')}>
        <span className={cx('labelStart')}>
          {startLabel}
        </span>

        <span className={cx('labelEnd')}>
          {endLabel}
        </span>
      </div>

      <FFDatePicker
        name={ORDER_DATE}
        className={cx('datepicker')}
        onChangeProxy={formatDate}

        minStart={countMinStartDate()}
        maxStart={countMaxStartDate()}
        minEnd={countMinEndDate(values?.date?.length ? values.date[0] : null)}
        maxEnd={countMaxEndDate(values?.date?.length ? values.date[0] : null)}
        isWeekendDisabled={isWeekendDisabled}
        isEndDisabled={isEndDisabled}

        countMinEnd={countMinEndDate}
        countMaxStart={countMaxStartDate}
        countMaxEnd={countMaxEndDate}
        holidays={holidays}
        isInputsReadOnly={isInputsReadOnly}
      />

      <InfoText className={cx('infoText')}>
        {infoText?.replace('{date}', moment(countMinStartDate()).format('DD MMMM'))}
      </InfoText>
    </div>
  );
}

LaunchDates.propTypes = {
  title: PropTypes.string,
  tooltip: PropTypes.string,
  startLabel: PropTypes.string,
  endLabel: PropTypes.string,
  className: PropTypes.string,
  infoText: PropTypes.string,
};

export default observer(LaunchDates);
