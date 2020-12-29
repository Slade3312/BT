import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { isNullOrUndefined } from 'utils/fn';
import { getDisplayType, getCalculatedWidth } from './helpers';
import { FADE } from './constants';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

/**
 * A stateful static content container,
 * that fixes on top of the screen when scrolled over
 *
 * Decomposition is not recommended due to tight coupling
 */
export default class FollowContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: null, // buffer for container width
      height: null,
      top: null,
      bottom: null,
      displayType: null,
    };
    this.domNode = React.createRef();
    this.mutationObserver = null;
    this.intersectionObserver = null;
    this.yOffset = 0;

    /**
     * Save last scroll direction; in case update was called,
     * and there was no scrolling, we use previous value
     */
    this.isTopScrolling = false;
  }

  componentDidMount() {
    this.handleScroll();
    this.initBaseListeners();
    this.initWatchingNodeMutations();
    this.initWatchingViewPortIntersections();
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleScroll);
    this.mutationObserver.disconnect();
    this.intersectionObserver.disconnect();
  }

  initBaseListeners = () => {
    document.addEventListener('scroll', this.handleScroll);
    if (this.props.watchResize) {
      window.addEventListener('resize', this.handleScroll);
    }
  };

  initWatchingNodeMutations = () => {
    this.mutationObserver = new MutationObserver(() => {
      requestAnimationFrame(this.handleScroll);
    });
    this.mutationObserver.observe(this.getFirstChildDOMNode(), {
      attributes: true,
      childList: true,
      subtree: true,
    });
  };

  initWatchingViewPortIntersections = () => {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          requestAnimationFrame(this.handleScroll);
        }
      },
      { threshold: 1.0, root: null },
    );
    this.intersectionObserver.observe(this.getFirstChildDOMNode());
  };

  getDOMNode = () => this.domNode?.current;
  getFirstChildDOMNode = () => this.getDOMNode().childNodes[0];
  getParentDOMNode = () => this.getDOMNode()?.parentNode;
  getContainerDOMNode = () => this.props.containerNode || this.getParentDOMNode()?.parentNode;

  getAnimationClass = () => {
    const { toggleAnimation } = this.props;

    if (toggleAnimation === FADE) return 'fade';

    return null;
  };

  handleScroll = () => {
    const { watchResize, offsetTop, offsetBottom, toBottom, preventFixLeft } = this.props;
    const scrollDelta = window.pageYOffset - this.yOffset;
    this.yOffset = window.pageYOffset;

    /** if we got a real scroll, determine new direction, otherwise, just keep previous */
    this.isTopScrolling = scrollDelta !== 0 ? scrollDelta < 0 : this.isTopScrolling;

    const containerDomNode = this.getContainerDOMNode();
    const parentNode = this.getParentDOMNode();

    if (containerDomNode && parentNode) {
      const { positionTop, positionBottom, displayType, positionLeft } = getDisplayType(
        this.getDOMNode(),
        containerDomNode,
        offsetTop,
        offsetBottom,
        this.isTopScrolling,
        toBottom,
        preventFixLeft,
      );

      const nextState = {
        width: `${getCalculatedWidth(parentNode)}px`,
        height: `${this.getDOMNode().clientHeight}px`,
        top: positionTop ? `${positionTop}px` : null,
        bottom: positionBottom ? `${positionBottom}px` : null,
        left: !isNullOrUndefined(positionLeft) ? `${positionLeft}px` : null,
        displayType,
      };
      /**
       * instead of calling setState immediately, we do shallow compare in order to remove unwanted renders
       */
      if (
        nextState.displayType !== this.state.displayType ||
        (watchResize && (nextState.width !== this.state.width || nextState.height !== this.state.height)) ||
        (watchResize && (toBottom && nextState.bottom !== this.state.bottom)) ||
        (watchResize && (preventFixLeft && nextState.left !== this.state.left))
      ) {
        this.setState(nextState);
      }
    }
  };

  render() {
    const { displayType, width, height, top, bottom, left } = this.state;
    const { children, withShadow, className, id } = this.props;

    return (
      <div className={cx('container', { shadow: withShadow }, className)} style={{ height }} id={id}>
        <div
          ref={this.domNode}
          className={cx('component', this.getAnimationClass(), displayType)}
          style={{ width, top, bottom, left }}
        >
          {children}
        </div>
      </div>
    );
  }
}

FollowContainer.defaultProps = {
  offsetTop: 0,
  offsetBottom: 0,
  toBottom: false,
};

FollowContainer.propTypes = {
  children: PropTypes.node,
  containerNode: PropTypes.object, // container DOM Node
  withShadow: PropTypes.bool, // should shadow be shown when navigation is fixed or not
  watchResize: PropTypes.bool, // adds overhead on scroll and resize, but allows usage with not 100% containers
  offsetTop: PropTypes.number, // fix offset, if toBottom - bottom offset, else top
  offsetBottom: PropTypes.number, // fix bottom offset on common follow
  preventFixLeft: PropTypes.bool, // will safe horizontal scroll on top fixed position
  toggleAnimation: PropTypes.oneOf([FADE]), // always visible by default
  className: PropTypes.string,
  id: PropTypes.string, // plain dom node id
  toBottom: PropTypes.bool, // stick to bottom mode
};
