import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FadeTransitionWrapper } from 'components/helpers';
import IconLink from 'components/buttons/IconLinks/IconLink';
import { Icon, TextContent } from './components';
import styles from './styles.pcss';

const cx = classNames.bind({ ...styles });

export default function CardInfo({
  currentContentIndex,
  iconSlag,
  title,
  buttonHref,
  buttonText,
  description,
  className,
  onButtonClick,
  children,
}) {
  return (
    <div className={cx('container', className)}>
      <FadeTransitionWrapper
        currentIndex={currentContentIndex}
        className={cx('contentWrapper')}
      >
        <div className={cx('iconContainer')}>
          <Icon slug={iconSlag} />
        </div>

        <h6 className={cx('titleContainer')}>{title}</h6>

        <TextContent>{description}</TextContent>
      </FadeTransitionWrapper>

      {children}

      {buttonText && (
        <IconLink
          target="_blank"
          href={buttonHref}
          className={cx('button')}
          onClick={onButtonClick}
          slug=""
        >
          <span className={cx('buttonText')}>
            {buttonText}
          </span>
        </IconLink>
      )}
    </div>
  );
}

CardInfo.propTypes = {
  currentContentIndex: PropTypes.number,
  title: PropTypes.string,
  iconSlag: PropTypes.string,
  className: PropTypes.string,
  buttonText: PropTypes.string,
  buttonHref: PropTypes.string,
  description: PropTypes.string,
  onButtonClick: PropTypes.func,
  children: PropTypes.node,
};
