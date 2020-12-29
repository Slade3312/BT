import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import withForwardedRef from 'enhancers/withForwardedRef';

export default function withAllChartsRenderedCallback(WrappedComponent) {
  @observer
  class ReadyChartsController extends React.Component {
    constructor(props) {
      super(props);
      this.chartInstanses = {};
      this.countsAreReady = 0;
      this.isChartsReady = false;
    }

    static contextType = StoresContext

    handleChartRendered = (chartIns, chartId) => {
      const { Reports } = this.context;
      if (this.isChartsReady) return;
      if (!this.chartInstanses[chartId]) {
        this.countsAreReady += 1;
        this.chartInstanses[chartId] = chartIns;
      }
      if (this.countsAreReady === Reports.charts.length) {
        this.props.onAllChartsAreReady(this.chartInstanses);
        this.isChartsReady = true;
      }
    };

    render() {
      const { onAllChartsAreReady, ...otherProps } = this.props;
      return <WrappedComponent {...otherProps} onRendered={this.handleChartRendered} />;
    }
  }

  ReadyChartsController.propTypes = {
    onAllChartsAreReady: PropTypes.func,
    chartsCount: PropTypes.number,
  };

  return withForwardedRef(ReadyChartsController);
}
