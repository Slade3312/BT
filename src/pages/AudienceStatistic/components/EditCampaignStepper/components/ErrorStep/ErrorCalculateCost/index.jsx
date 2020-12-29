import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { PhoneInfo } from 'components/layouts';
import commonStyles from 'styles/common.pcss';
import ErrorBase from '../ErrorBase';
import CreateCampaignButton from '../../CreateCampaignButton';
import ProcessInfoText from '../../../../ProcessInfoText';
import DescriptionWrapper from '../../DescriptionWrapper';

const cx = classNames.bind(commonStyles);

function ErrorCalculateCost() {
  const {
    CreateReport: {
      error,
    },
    Templates: {
      getPopupsTemplate,
    },
  } = useContext(StoresContext);
  const { button, infoText, phone, icon } = getPopupsTemplate('ErrorCalculateCost');
  return (
    <ErrorBase title={error.title} level={2} iconType={icon}>
      <DescriptionWrapper className={cx('marb-l')} level={3}>
        <ProcessInfoText>{error.description || ''}</ProcessInfoText>
      </DescriptionWrapper>

      <CreateCampaignButton iconSlug="arrowRightMinimal" className={cx('marb-l')}>
        {button}
      </CreateCampaignButton>

      <div className={cx('marb-xxs')}>{infoText}</div>

      <PhoneInfo>{phone}</PhoneInfo>
    </ErrorBase>
  );
}

export default observer(ErrorCalculateCost);
