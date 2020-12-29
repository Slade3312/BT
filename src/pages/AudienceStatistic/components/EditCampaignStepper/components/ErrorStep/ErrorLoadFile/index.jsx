import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import commonStyles from 'styles/common.pcss';
import { StoresContext } from 'store/mobx';
import ErrorBase from '../ErrorBase';
import CreateCampaignButton from '../../CreateCampaignButton';
import ProcessInfoText from '../../../../ProcessInfoText';
import DescriptionWrapper from '../../DescriptionWrapper';
import FileInfo from '../../FileInfo';

const cx = classNames.bind(commonStyles);

function ErrorLoadFile() {
  const {
    CreateReport: {
      error,
    },
  } = useContext(StoresContext);
  return (
    <ErrorBase title={error.title} level={3}>
      <FileInfo className={cx('marb-l')} />

      <DescriptionWrapper className={cx('marb-l')} level={4}>
        <ProcessInfoText>{error.description || ''}</ProcessInfoText>
      </DescriptionWrapper>

      <CreateCampaignButton iconSlug="arrowRightLong" className={cx('marb-l')}>
        Загрузить другой файл
      </CreateCampaignButton>
    </ErrorBase>
  );
}

export default observer(ErrorLoadFile);
