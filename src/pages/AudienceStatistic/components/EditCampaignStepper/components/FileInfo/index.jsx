import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import { GlobalIcon } from 'components/common';
import { StoresContext } from 'store/mobx';
import {
  FIELD_FILE_NAME,
  FIELD_FILE_SIZE,
} from 'pages/AudienceStatistic/components/EditCampaignStepper/constants';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

function FileInfo({ className }) {
  const {
    CreateReport:
    {
      values,
    },
  } = useContext(StoresContext);

  const dividedName = values[FIELD_FILE_NAME]?.split('.');
  const fileExt = dividedName[dividedName.length - 1].toLowerCase();

  return (
    <div className={cx('component', className)}>
      <span className={cx('fileName')}>
        <GlobalIcon className={cx('formatIcon')} slug={GlobalIcon.getFileIconSlug(fileExt)} />
        { values[FIELD_FILE_NAME] }
      </span>
      <span className={cx('fileFormat')}>
        ({fileExt}, {(values[FIELD_FILE_SIZE] / 1024).toFixed(2)} КБ)
      </span>
    </div>
  );
}

FileInfo.propTypes = {
  className: PropTypes.string,
};

export default observer(FileInfo);
