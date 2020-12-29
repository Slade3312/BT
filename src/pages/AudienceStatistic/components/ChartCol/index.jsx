import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import {
  CHART_PICTORIAL_BAR,
  CHART_SIMPLE_BAR_COLORED,
  CHART_TREE_MAP,
  CHART_TRIPLE_PIE_BARS,
  CHART_SIMPLE_BAR,
} from 'store/AudienceStatistic/reportData/constants';
import { findLongestStringBy } from 'utils/fn';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const wideCharts = [CHART_SIMPLE_BAR_COLORED, CHART_TREE_MAP, CHART_PICTORIAL_BAR, CHART_TRIPLE_PIE_BARS];
const checkIsWideChart = type => wideCharts.includes(type);

const calcWidth = (data, type, title) => {
  switch (type) {
    case CHART_SIMPLE_BAR: {
      if (title.toLowerCase() === 'доход') {
        return '100%';
      }
      const maxLength = findLongestStringBy(data, elem => elem.name);
      return maxLength > 13 ? '100%' : null;
    }
    default: {
      return null;
    }
  }
};

export function ChartCol({ children, type, data, title }) {
  return (
    <div style={{ width: calcWidth(data, type, title) }} className={cx('component', { wide: checkIsWideChart(type) })}>
      {children}
    </div>
  );
}

ChartCol.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.any),
  title: PropTypes.string,
};
