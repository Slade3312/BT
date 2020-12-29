import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import { StoresContext } from 'store/mobx';
import { formatPriceWithLabel } from 'utils/formatting';
import { ActionLink } from 'components/buttons';
import { Background } from 'components/common/Banner/components';

import commonStyles from 'styles/common.pcss';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

function MainBanner({ className }) {
  const { Templates } = useContext(StoresContext);
  const { dashboard } = Templates.data;

  return (
    <div className={cx('component', className)}>
      <h1 className={cx('marb-s', 'title')}>{dashboard?.MainBanner?.title}</h1>

      <p className={cx('marb-l', 'description')}>{dashboard?.MainBanner?.description}</p>

      <div className={cx('marb-l', 'price')}>
        {dashboard?.MainBanner?.pricePrefix} {dashboard?.MainBanner?.price && formatPriceWithLabel(dashboard?.MainBanner?.price)}
      </div>

      <ActionLink
        href={dashboard?.MainBanner?.buttonUrl}
        className={cx('marb-l', 'button')}
      >
        {dashboard?.MainBanner?.button}
      </ActionLink>

      <Background image={dashboard?.MainBanner?.background} className={cx('background')} />
    </div>
  );
}

MainBanner.propTypes = {
  className: PropTypes.string,
};

export default observer(MainBanner);
