import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { axiosAuthorizedRequest } from 'requests/helpers';
import { pushTopNavClickToGA } from 'utils/ga-analytics/utils';
import headerModel from 'requests/common/data/headerModel';
import UserInfo from 'store/mobx/UserInfo';

import { AuthBlock, AuthLink, AuthPopup } from '../../components';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

function AuthContainer({ isMobile }) {
  const { username } = UserInfo;

  const handleItemClick = async (event, link) => {
    pushTopNavClickToGA({ slugTitle: headerModel.blocks.profile.title, subSlugTitle: link.title });

    if (link.isLogout) {
      event.preventDefault();
      await axiosAuthorizedRequest({ url: '/logout/' });
      window.location.reload();
    }
  };

  if (!username) return null;

  return (
    <AuthBlock
      isMobile={isMobile}
      className={cx('component', { mobile: isMobile })}
      renderComponent={({ isOpen, onClose }) => (
        <AuthPopup isOpen={isOpen} onClose={onClose} isMobile={isMobile} className={cx('popup')}>
          {headerModel.blocks.profile.links.map(item => (
            <AuthLink
              href={item.href}
              key={item.title}
              onClick={event => handleItemClick(event, item)}
              >
              {item.title}
            </AuthLink>
            ))}
        </AuthPopup>
      )}
      >
      {username}
    </AuthBlock>
  );
}

AuthContainer.propTypes = {
  isMobile: PropTypes.bool,
};

export default observer(AuthContainer);
