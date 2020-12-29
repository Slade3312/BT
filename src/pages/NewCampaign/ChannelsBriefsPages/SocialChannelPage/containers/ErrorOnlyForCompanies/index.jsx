import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import ErrorBase from 'components/common/ErrorBase';
import { PopupStateless } from 'components/common';
import styles from './styles.pcss';

const ErrorOnlyForCompanies = ({ setIsModalOpened }) => {
  return (
    <PopupStateless opened onClose={() => setIsModalOpened(false)}>
      <ErrorBase level={2} title="Ограниченный доступ">
        <div className={styles.description}>Данный канал доступен только для Юридических лиц и ИП</div>
      </ErrorBase>
    </PopupStateless>
  );
};

ErrorOnlyForCompanies.propTypes = {
  setIsModalOpened: PropTypes.func,
};

export default observer(ErrorOnlyForCompanies);
