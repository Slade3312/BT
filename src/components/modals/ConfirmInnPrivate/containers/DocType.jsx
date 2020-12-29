import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Common from 'store/mobx/Common';
import Templates from 'store/mobx/Templates';
import commonStyles from 'styles/common.pcss';
import { FFSelect } from 'components/fields';

import styles from '../styles.pcss';
import { CONFIRM } from '../index';

const cx = classNames.bind({ ...commonStyles, ...styles });

const DocType = ({ confirmation }) => {
  const { docTypesList } = Common;
  const { getConfirmInnPrivateTemplate } = Templates;
  return (
    <div className={cx('inputRow')}>
      <div className={styles.labelHolder}>
        <label htmlFor={CONFIRM.DOCTYPE}>{getConfirmInnPrivateTemplate('docType')}</label>
      </div>

      <FFSelect
        options={docTypesList}
        value={confirmation.values[CONFIRM.DOCTYPE]}
        name={CONFIRM.DOCTYPE}
        keepErrorIndent={false}
        className={styles.select}
       />
    </div>
  );
};

DocType.propTypes = {
  confirmation: PropTypes.object,
};

export default observer(DocType);
