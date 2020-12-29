import React from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from 'utils/prop-types';
import { map } from 'utils/fn';
import { withTakeScreenshot } from '../../enhancers';
import { ScreenshotLayout } from './components';
import { ReportScreenshotContext } from './context';

class ReportScreenshotMaker extends React.Component {
  constructor(props) {
    super(props);
    this.chartInstances = {};
    this.isChartsReady = false;
    // if we have called function before all charts are ready we have to keep this call
    // and after full initializing (all charts are rendered) execute handleTakeScreenshot immediately
    this.hasPlannedScreenshot = false;

    this.providerValue = {
      onTakeScreenshot: this.handleTakeScreenshot,
    };
  }

  handleAllChartsAreReady = (chartInstances) => {
    this.isChartsReady = true;
    this.chartInstances = chartInstances;
    if (this.hasPlannedScreenshot) {
      this.handleTakeScreenshot();
    }
  };

  handleTakeScreenshot = () => {
    if (!this.isChartsReady) {
      this.hasPlannedScreenshot = true;
      console.warn("Charts aren't ready for screenshot rendering");
      return;
    }

    map(this.chartInstances, (chart) => {
      chart.setOption({
        animation: false,
        toolbox: {
          show: false,
        },
      });
    });

    this.props.onTakeScreenshot();
  };

  render() {
    const { screenNodeRef, children, ScreenshotContainer } = this.props;
    return (
      <ReportScreenshotContext.Provider value={this.providerValue}>
        <ScreenshotLayout>
          <ScreenshotContainer onAllChartsAreReady={this.handleAllChartsAreReady} ref={screenNodeRef} />
        </ScreenshotLayout>
        {children}
      </ReportScreenshotContext.Provider>
    );
  }
}

ReportScreenshotMaker.propTypes = {
  screenNodeRef: CustomPropTypes.ref,
  ScreenshotContainer: CustomPropTypes.ref,
  children: PropTypes.node,
  onTakeScreenshot: PropTypes.func,
};

export default withTakeScreenshot(ReportScreenshotMaker);

