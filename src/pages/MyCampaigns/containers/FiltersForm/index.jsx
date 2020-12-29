import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import { FinalForm } from 'components/forms';
import { FFSearchInput, FFSelect } from 'components/fields';
import { StoresContext } from 'store/mobx';

import {
  STATUS_FILTER_NAME,
  CHANNELS_FILTER_NAME,
  SEARCH_FILTER_NAME,
} from '../../constants';

import { FiltersContainer, ColumnCell, ColumnName } from '../../components';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function FiltersForm() {
  const { MyCampaigns, Common } = useContext(StoresContext);
  const { filter: values, syncMyCampaignsFilters: onChange } = MyCampaigns;
  return (
    <FinalForm onChange={onChange} values={values}>
      <FiltersContainer>
        <ColumnCell type={ColumnCell.propConstants.types.name}>
          <FFSearchInput placeholder="Поиск по названию" name={SEARCH_FILTER_NAME} />
        </ColumnCell>

        <ColumnCell type={ColumnCell.propConstants.types.channel}>
          <FFSelect
            options= {Common.getChannelsOptions}
            name={CHANNELS_FILTER_NAME}
            placeholder="Все каналы"
          />
        </ColumnCell>

        <ColumnCell type={ColumnCell.propConstants.types.status}>
          <FFSelect
            options= {Common.getOrderStatusesOptions}
            name={STATUS_FILTER_NAME}
            placeholder="Статус"
          />
        </ColumnCell>

        <ColumnCell type={ColumnCell.propConstants.types.date} className={cx('textIndent')}>
          <ColumnName>Дата</ColumnName>
        </ColumnCell>
      </FiltersContainer>
    </FinalForm>
  );
}


export default observer(FiltersForm);
