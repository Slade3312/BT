import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { PureButton } from 'components/buttons';
import { GlobalIcon } from 'components/common';
import { Heading } from 'components/layouts';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const CurrentTaxonSubgroup = ({ children, groupNumberUid, className }) => {
  const { NewCampaign } = useContext(StoresContext);
  const { name, group_uid: subGroupUid } = NewCampaign.taxonsSubGroupTaxonsData(groupNumberUid);

  const isOpen = NewCampaign.openTaxonsSubgroups.includes(subGroupUid);

  const handleCloseToggle = () => {
    NewCampaign.setTaxonsSubGroupOpen({ key: subGroupUid, flag: false });
  };
  const handleOpenToggle = () => {
    NewCampaign.setTaxonsSubGroupOpen({ key: subGroupUid, flag: true });
  };
  return (
    <div className={cx('component', { open: isOpen }, className)}>
      <PureButton onClick={!isOpen ? handleOpenToggle : handleCloseToggle} className={cx('title')}>
        <Heading level={4}>
          {name}
          <GlobalIcon slug="dropdownArrow" className={cx('arrow')} />
        </Heading>
      </PureButton>

      {isOpen && <div className={cx('content')}>{children}</div>}
    </div>
  );
};

CurrentTaxonSubgroup.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  groupNumberUid: PropTypes.number,
};

export default observer(CurrentTaxonSubgroup);
