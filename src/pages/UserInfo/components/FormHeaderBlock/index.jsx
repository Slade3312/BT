import React, { useContext } from 'react';
import PropsTypes from 'prop-types';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { Heading } from 'components/layouts';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const FormHeaderBlock = ({ isMobile, isCompact }) => {
  const { UserInfo } = useContext(StoresContext);

  return (
    <div className={cx('wrapper', { mobile: isMobile, compact: isCompact })}>
      <Heading level={4} className={cx('title', { mobile: isMobile })}>
        {!isMobile ? 'Контактные данные' : 'Данные компании'}
      </Heading>

      {!UserInfo.isEditable && (
        <button
          className={cx('button', { mobile: isMobile })}
          onClick={() => {
            UserInfo.set('isEditable', true);
          }}
        >
          редактировать
        </button>
      )}
    </div>
  );
};

FormHeaderBlock.propTypes = {
  isMobile: PropsTypes.bool,
  isCompact: PropsTypes.bool,
};

export default observer(FormHeaderBlock);
