import React, { useCallback, useEffect, useMemo, useState, useContext } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import ChartWrapper from '../../components/ChartWrapper';
import { getOptionsWithToolboxByFlags } from '../../utils/get-options-with-toolbox-by-flags';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const withChartView = (WrappedComponent) => {
  const ChartView = ({
    title,
    tooltip,
    onErase,
    onExpand,
    hasCollapse,
    hasErase,
    hasLineView,
    hasBarView,
    hasRestore,
    hasSaveAsImage,
    id,
    onRendered,
    ...otherProps
  }) => {
    const {
      Reports:
      {
        setChartsOptions,
        setFrameControlsExpand,
        setFrameControlsErase,
        getSavedChartsOptions,
        getFrameControls,
      },
    } = useContext(StoresContext);
    const [chartInstance, setChartInstance] = useState(null);

    const [isPreventChartOptions, setPreventChartOptionsUpdate] = useState(false);

    const chartOptions = getSavedChartsOptions(id);
    const frameControls = getFrameControls(id);

    const isFrameErased = frameControls?.isErased ?? false;
    const isFrameExpanded = frameControls?.isExpanded ?? true;

    const handleSwitchExpanded = () => {
      setFrameControlsExpand({ data: !isFrameExpanded, key: id });
    };

    const handleErase = () => {
      setFrameControlsErase({ data: true, key: id });
    };

    const options = useMemo(
      () => getOptionsWithToolboxByFlags({ hasLineView, hasBarView, hasRestore, hasSaveAsImage }),
      [hasLineView, hasBarView, hasRestore, hasSaveAsImage],
    );

    const handleChangeChartOptions = (nextOptions) => {
      setPreventChartOptionsUpdate(true);
      setChartsOptions({ data: nextOptions, key: id });
    };

    const handleRendered = (chartIns) => {
      if (!chartInstance) {
        setChartInstance(chartIns);
      }
      if (onRendered) {
        onRendered(chartIns, id);
      }
    };

    // don't set current option if we have already changed current option via setChartsOptions from current field
    // because echart's chart is uncontrolled component
    const chartOptionsDidUpdate = useCallback(() => {
      if (isPreventChartOptions) {
        setPreventChartOptionsUpdate(false);
        return;
      }
      if (chartInstance && chartOptions) {
        chartInstance.setOption(chartOptions);
      }
    }, [chartOptions]);

    useEffect(() => {
      chartOptionsDidUpdate();
    }, [chartOptions]);

    return (
      <ChartWrapper
        title={title}
        tooltip={tooltip}
        isFrameExpanded={isFrameExpanded}
        onErase={handleErase}
        onExpand={handleSwitchExpanded}
        hasCollapse={hasCollapse}
        hasErase={hasErase}
      >
        <WrappedComponent
          {...otherProps}
          chartOptions={chartOptions}
          isFrameExpanded={isFrameExpanded}
          isFrameErased={isFrameErased}
          title={title}
          existingOptions={options}
          className={cx('component')}
          onRendered={handleRendered}
          onChangeOptions={handleChangeChartOptions}
          id={id}
        />
      </ChartWrapper>
    );
  };
  ChartView.propTypes = {
    title: PropTypes.string,
    tooltip: PropTypes.string,
    id: PropTypes.number,
    onErase: PropTypes.func,
    onRendered: PropTypes.func,
    onExpand: PropTypes.func,
    hasCollapse: PropTypes.bool,
    hasErase: PropTypes.bool,
    hasLineView: PropTypes.bool,
    hasBarView: PropTypes.bool,
    hasRestore: PropTypes.bool,
    hasSaveAsImage: PropTypes.bool,
  };
  return observer(ChartView);
};

export default withChartView;
