import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { StoresContext } from 'store/mobx';
import { wordFormByCount } from 'utils/fn';
import { REPORT_CORE_ITEMS_TITLE } from 'store/AudienceStatistic/reportData/constants';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

function ReportCoreMetaInfo({ className, campaignId }) {
  const { Reports: { coreInfoById, orderFocusData } } = useContext(StoresContext);
  const genderAndAgeDescriptions = coreInfoById[REPORT_CORE_ITEMS_TITLE.GENDER_AND_AGE]?.descriptions || [];
  const { quantityMin, formattedDateStart } = orderFocusData(campaignId);
  return (
    <div className={className}>
      <div className={cx('textInfo')}>Дата создания - {formattedDateStart}</div>

      <div className={cx('textInfo')}>
        В вашей базе номеров {quantityMin} {wordFormByCount(quantityMin, ['абонент', 'абонента', 'абонентов'])} Билайн
      </div>

      <div className={cx('textInfo')}>
        <span>Большинство -</span>
        {genderAndAgeDescriptions.map(text => (
          <span key={text} className={cx('coreItem')}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

ReportCoreMetaInfo.propTypes = {
  className: PropTypes.string,
  campaignId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default observer(ReportCoreMetaInfo);
