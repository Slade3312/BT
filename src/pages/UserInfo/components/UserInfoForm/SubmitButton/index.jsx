import React, { useContext, useRef } from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { ActionButton } from 'components/buttons';
import { withWrapper } from 'components/fields/TextInput/enhancers';
import { useScrollToInvalid } from 'hooks/use-scroll-to-invalid';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const ButtonWrapper = withWrapper({ labelSide: 'left' })(({ children }) => <div>{children}</div>);

function SubmitButton() {
  const { UserInfo } = useContext(StoresContext);
  const buttonRef = useRef();

  const onScrollToInvalid = useScrollToInvalid(buttonRef.current);

  return UserInfo.isEditable ? (
    <ButtonWrapper isNullLabel isLeftLabel>
      <ActionButton buttonRef={buttonRef} onClick={onScrollToInvalid} type="submit" className={cx('button')}>
        Сохранить
      </ActionButton>
    </ButtonWrapper>
  ) : null;
}

export default observer(SubmitButton);
