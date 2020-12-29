import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { GlobalIcon } from 'components/common';
import { PureButton } from 'components/buttons';
import { PortalWrapper } from 'components/helpers';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const defaultCoordinates = { x: 0, y: 0 };

export default function TagNode({ url, onRemove, index, onShort, isShortLink }) {
  const componentRef = useRef();

  const handleShort = () => onShort(url);
  const handleRemove = () => onRemove(index);

  const [posXY, setPosXY] = useState(defaultCoordinates);
  const [isActiveMenu, setIsActiveMenu] = useState(false);

  const handleMouseEnter = () => {
    const { top, left } = componentRef.current.getBoundingClientRect();
    setPosXY({ x: left, y: top + pageYOffset });
    setIsActiveMenu(true);
  };
  const handleMouseLeave = () => {
    setIsActiveMenu(false);
    setPosXY(defaultCoordinates);
  };

  return (
    <div ref={componentRef} data-url={url} data-tag="true" className={cx('tagParent')} onMouseLeave={handleMouseLeave}>
      <div className={cx('tagStyled')}>
        <div className={cx('cross')} onMouseEnter={handleMouseEnter} />
        <PortalWrapper>
          <div className={cx('menuWrapper')}>
            <div className={cx('menu', { active: isActiveMenu })} style={{ top: posXY.y, left: posXY.x }}>
              <div className={cx('menuContent')}>
                <PureButton
                  onClick={handleShort}
                  type="button"
                  name="menuButton"
                  className={cx('menuButton', 'firstButton')}
                >
                  <GlobalIcon slug="clip" />
                  {!isShortLink ? 'Сократить ссылку' : 'Вернуть ссылку'}
                </PureButton>

                <PureButton
                  onClick={handleRemove}
                  type="button"
                  name="menuButton"
                  className={cx('menuButton', 'firstButton')}
                >
                  <GlobalIcon slug="cross" />
                  Удалить ссылку
                </PureButton>
              </div>
            </div>
          </div>
        </PortalWrapper>
        <span className={cx('label')}>{url}</span>
      </div>
    </div>
  );
}

TagNode.propTypes = {
  url: PropTypes.string,
  isShortLink: PropTypes.bool,
  onRemove: PropTypes.func,
  onShort: PropTypes.func,
  index: PropTypes.number,
};
