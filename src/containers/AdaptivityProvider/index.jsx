import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { breakpoints } from 'store/common/breakpoint/constants';
import { getBreakpoint } from 'store/common/breakpoint/selectors';
import { setBreakpoint as setBreakpointAction } from 'store/common/breakpoint/actions';

import { simulateResize } from '../../utils/resize';
import { getWindowWidth } from './helpers';


/**
 * Listens resize to determine resolution, and pushes current breakpoint value into store
 */
export class ResizeListener extends React.Component {
  state = { isReady: false };
  /**
   * initially loads Desktop to properly handle React.hydrate
   * afterwards
   */
  componentDidMount() {
    window.addEventListener('resize', this.updateBreakpoint);
    this.updateBreakpoint();
  }

  /**
   * this function fires each time after setBreakpoint updated the react tree
   * we simulate resize at this point in order to fix possible issues caused by late react tree re-render
   */
  componentDidUpdate() {
    simulateResize();
  }

  updateBreakpoint = () => {
    const windowWidth = getWindowWidth();
    const { breakpoint, setBreakpoint } = this.props;

    /** find closest breakpoint that we are surpassed in width */
    const newBreakpoint = breakpoints.find(bp => bp <= windowWidth);

    /** only call dispatcher if value changed */
    if (breakpoint !== newBreakpoint) {
      setBreakpoint(newBreakpoint);
    }
    if (!this.state.isReady) this.setState({ isReady: true });
  };

  render() {
    return this.state.isReady ? this.props.children : null;
  }
}

ResizeListener.propTypes = {
  children: PropTypes.node,
  breakpoint: PropTypes.number,
  setBreakpoint: PropTypes.func,
};


const mapStateToProps = state => ({
  breakpoint: getBreakpoint(state),
});

const mapDispatchToProps = ({
  setBreakpoint: setBreakpointAction,
});

export default connect(mapStateToProps, mapDispatchToProps)(ResizeListener);
