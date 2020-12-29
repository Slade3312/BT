import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import commonStyles from 'styles/common.pcss';
import { B2BTooltip } from 'components/common/Tooltip';
import PhoneInfo from 'components/layouts/PhoneInfo';
import Heading from 'components/layouts/Heading';
import CustomPropTypes from 'utils/prop-types';
import ActionLink from '../../buttons/ActionButtons/ActionLink';
import ActionButton from '../../buttons/ActionButtons/ActionButton';
import Background from './components/Background';
import styles from './styles.pcss';

const cx = classNames.bind({ ...styles, ...commonStyles });

function Banner(props) {
  const { isPersonal, href, price, title, description, button, background, phone, subContent } = props;
  const { tooltip, onClick, onButtonClick, isLight, isMobile, isWide, className } = props;
  return (
    <div
      className={cx('wrapper', { light: isLight, mobile: isMobile, personal: isPersonal }, className)}
      onClick={onClick}
    >
      <Background {...background} className={cx('background')} />

      <div className={cx('content')}>
        {tooltip && (
          <B2BTooltip className={cx('tooltip')}>
            <div>{tooltip}</div>
          </B2BTooltip>
        )}
        {title && (
          <Heading className={cx('title')}>{title}</Heading>
        )}
        {price && <div className={cx('price')}>{price}</div>}

        {description && <div className={cx('description', { wide: isWide })}>{description}</div>}
        <div className={cx('filler')} />

        {subContent && <div className={cx('mart-s')}>{subContent}</div>}

        {button && (
          <div>
            <div className={cx('buttonContent')}>
              {href && (
                <ActionLink
                  {...button}
                  href={href}
                  className={cx('button', { light: button.isLight })}
                  iconSlug="arrowRightMinimal"
                >
                  {button.text}
                </ActionLink>
              )}
              {onButtonClick && (
                <ActionButton
                  {...button}
                  onClick={onButtonClick}
                  className={cx('button', { light: button.isLight })}
                  iconSlug="arrowRightMinimal"
                >
                  {button.text}
                </ActionButton>
              )}
              {phone && (
                <PhoneInfo className={cx('phone')}>{phone}</PhoneInfo>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Banner.propTypes = {
  isPersonal: PropTypes.bool,
  isWide: PropTypes.bool,
  href: PropTypes.string,
  price: PropTypes.node,
  subContent: PropTypes.node,
  title: CustomPropTypes.templateField,
  description: CustomPropTypes.templateField,
  phone: PropTypes.string,
  button: PropTypes.shape({
    text: PropTypes.string,
    href: PropTypes.string,
    isLight: PropTypes.bool,
  }),
  background: PropTypes.shape(Background.propTypes),
  tooltip: CustomPropTypes.templateField,
  onClick: PropTypes.func,
  onButtonClick: PropTypes.func,
  isLight: PropTypes.bool,
  isMobile: PropTypes.bool,
  className: PropTypes.string,
};

export default Banner;
