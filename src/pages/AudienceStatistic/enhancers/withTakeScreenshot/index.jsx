import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';

const LazyScreenshotModules = async () =>
  Promise.all([
    import(/* webpackChunkName: "html2canvas" */ 'html2canvas'),
    import(/* webpackChunkName: "jspdf" */ 'jspdf'),
  ]).then(modules => modules.map(module => module.default));

export default function withTakeScreenshot(WrappedComponent) {
  @observer
  class WithScreenshot extends React.Component {
    constructor(props) {
      super(props);
      this.captureRef = React.createRef();
    }
    static contextType = StoresContext;

    handleTakeScreenshot = async () => {
      const { Reports: { chartRef, orderFocusData } } = this.context;
      const { formattedTitle, formattedDateStart } = orderFocusData();
      const node = chartRef;
      const { width, height } = node.getBoundingClientRect();
      const savedScroll = window.scrollY;
      window.scrollTo(0, 0);

      return LazyScreenshotModules().then(([Html2CanvasModule, JsPdfModule]) =>
        Html2CanvasModule(node).then((canvas) => {
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          const pdf = new JsPdfModule('px', 'px', [width, height]);
          const docWidth = pdf.internal.pageSize.getWidth();
          const docHeight = pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, 'JPEG', 0, 0, docWidth, docHeight);
          pdf.save(`${formattedTitle}-${formattedDateStart}.pdf`);
          window.scrollTo(0, savedScroll);
        }));
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          onTakeScreenshot={this.handleTakeScreenshot}
        />
      );
    }
  }

  WithScreenshot.propTypes = {
    onTakeScreenshot: PropTypes.func,
    documentTitle: PropTypes.string,
  };

  return WithScreenshot;
}
