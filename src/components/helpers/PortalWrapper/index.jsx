import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class PortalWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.portalRoot = document.getElementById(props.targetId);
  }

  componentDidMount() {
    this.portalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    this.portalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

PortalWrapper.propTypes = {
  children: PropTypes.node,
  targetId: PropTypes.string,
};

PortalWrapper.defaultProps = {
  targetId: 'notification',
};

export default PortalWrapper;
