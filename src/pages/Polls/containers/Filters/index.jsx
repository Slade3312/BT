import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import { useLocation } from '@reach/router';
import { FinalForm } from 'components/forms';
import { FFSearchInput, FFSelect } from 'components/fields';
import { StoresContext } from 'store/mobx';
import { ColumnCell } from 'components/common';
import { pushToGA } from 'utils/ga-analytics/data-layer';
import { useOnBlurBlockFieldsGA } from 'utils/ga-analytics/hooks';
import {
  STATUS_FILTER_NAME,
  SEARCH_FILTER_NAME,
} from '../../constants';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

function FiltersForm() {
  const { Common, Polls, Templates } = useContext(StoresContext);
  const { textfield, select, date } = Templates.getPollsTemplate('FiltersPanel');
  const location = useLocation();

  const handleBlurSearch = useOnBlurBlockFieldsGA({ event: 'event_b2b_search', search: Polls?.values[SEARCH_FILTER_NAME] });

  const handleStatusChange = (e) => {
    const { value } = e.target;
    const curLabel = Common.getPollsStatusesOptions.find(item => item.value === value);
    const eventAction = `set_${select}|${curLabel?.label}`;

    pushToGA({
      event: 'event_b2b',
      eventCategory: 'useFilter',
      eventAction,
      eventLabel: location.pathname,
    });
  };

  return (
    <FinalForm className={styles.component} onChange={e => Polls.set('values', e)} values={Polls.values}>
      <div className={cx('filterWrapper')}>
        <ColumnCell type="name">
          <FFSearchInput
            onBlur={handleBlurSearch}
            placeholder={textfield} name={SEARCH_FILTER_NAME}
            keepErrorIndent={false}
          />
        </ColumnCell>

        <ColumnCell type="status">
          <FFSelect
            name={STATUS_FILTER_NAME}
            options={Common.getPollsStatusesOptions}
            placeholder={select}
            onChange={handleStatusChange}
            keepErrorIndent={false}
          />
        </ColumnCell>

        <ColumnCell type="date" className={cx('textIndent')}>
          <span>{date}</span>
        </ColumnCell>
      </div>
    </FinalForm>
  );
}

export default observer(FiltersForm);
