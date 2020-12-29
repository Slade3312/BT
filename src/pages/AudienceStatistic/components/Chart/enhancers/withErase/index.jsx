import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function withErase(WrappedComponent) {
  class Hider extends React.Component {
    state = {
      isHidden: false,
    };

    constructor(props) {
      super(props);
      this.timerId = null;
    }

    componentWillUnmount() {
      clearTimeout(this.timerId);
    }

    handleHide = () => {
      this.setState({ isHidden: true });
      this.timerId = setTimeout(() => {
        this.props.onErase();
      }, this.props.animationDuration);
    };

    render() {
      return (
        <div className={cx('component', { hidden: this.state.isHidden })}>
          <WrappedComponent {...this.props} onErase={this.handleHide} />
        </div>
      );
    }
  }

  Hider.propTypes = {
    onErase: PropTypes.func,
    animationDuration: PropTypes.number,
  };
  Hider.defaultProps = {
    animationDuration: 300,
  };
  return Hider;
}
