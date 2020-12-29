import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import { ActionButton } from 'components/buttons';
import { StoresContext } from 'store/mobx';
import commonStyles from 'styles/common.pcss';
import ErrorBase from '../ErrorBase';
import DescriptionWrapper from '../../DescriptionWrapper';

const cx = classNames.bind(commonStyles);

function ErrorCreateOrder() {
  const {
    CreateReport: {
      error,
      processGoToReports,
      set,
    },
  } = useContext(StoresContext);
  return (
    <ErrorBase title={error.title} level={3}>
      <DescriptionWrapper className={cx('marb-l')} level={4}>{error.descripton || 'Что-то пошло не так, можно попробовать создать отчёт ещё раз'}</DescriptionWrapper>

      <ActionButton
        className={cx('marb-l')}
        onClick={error.isDraftError ? processGoToReports : () => set('isModalVisible', false)}
        iconSlug={error.isDraftError ? 'arrowRightLong' : ''}
      >
        {error.isDraftError ? 'Удалить черновики' : 'Назад'}
      </ActionButton>
    </ErrorBase>
  );
}

export default observer(ErrorCreateOrder);
