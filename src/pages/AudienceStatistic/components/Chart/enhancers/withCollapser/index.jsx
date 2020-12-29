import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function withCollapser(WrappedComponent) {
  class Collapser extends React.Component {
    state = {
      contentHeight: null,
    };
    constructor(props) {
      super(props);
      this.contentRef = React.createRef();
    }
    componentDidMount() {
      this.updateHeight();
    }
    componentDidUpdate(prev) {
      if (prev.isFrameExpanded !== this.props.isFrameExpanded) {
        this.updateHeight();
      }
    }
    updateHeight = () => {
      const { height } = this.contentRef.current.getBoundingClientRect();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ contentHeight: height });
    };

    getHeight = () => (!this.state.contentHeight ? '100%' : `${this.state.contentHeight}px`);

    render() {
      const { isFrameExpanded, ...otherProps } = this.props;
      return (
        <div
          style={{ height: isFrameExpanded ? this.getHeight() : 0 }}
          className={cx('component')}
        >
          <div ref={this.contentRef}>
            <WrappedComponent isFrameExpanded={isFrameExpanded} {...otherProps} />
          </div>
        </div>
      );
    }
  }

  Collapser.propTypes = {
    isFrameExpanded: PropTypes.bool,
    children: PropTypes.node,
  };
  return Collapser;
}
