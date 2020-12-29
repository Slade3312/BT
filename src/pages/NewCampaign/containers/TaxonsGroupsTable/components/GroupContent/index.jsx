import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { navigate, useParams } from '@reach/router';
import { PureButton } from 'components/buttons';
import { LightText } from 'components/common';
import { formatTenNumbersPhone } from 'utils/formatting';

import Tabs from '../Tabs';
import styles from './styles.pcss';

const GroupContent = ({ items, slug, title, text, onTabRemove, isDisabled }) => {
  const params = useParams();

  const handleClick = () => {
    if (params.campaignId) {
      navigate(`/new-campaign/${params.campaignId}/audience/${slug}`);
    }
  };

  const itemsExtOperator = items.filter((item) => item?.value?.external_operator);

  return (
    <div
      onClick={isDisabled ? () => {} : handleClick}
      key={title}
      className={classNames(styles.group, isDisabled && styles.disabled)}
    >
      <div className={styles.componentIn}>
        <div className={styles.title}>
          <span className={styles.text}>{title}</span>
        </div>
        {!items || (items && items.length === 0) ? (
          <div className={styles.emptyContent}>
            {text ? <LightText>{text}</LightText> : <span className={styles.text}><LightText>Не выбрано</LightText></span>}
          </div>
        ) : (
          <div className={styles.tabs}>
            <span>Всего фильтров: {items.length}</span>
            {itemsExtOperator.length !== 0 && <span>Фильтров для других операторов: {itemsExtOperator.length}</span>}
          </div>
        )}
        {!isDisabled && (
          <div className={styles.expandBtn}>
            <PureButton className={styles.button}>Настроить</PureButton>
          </div>
        )}
      </div>
    </div>
  );
};

GroupContent.propTypes = {
  items: PropTypes.array,
  slug: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  onTabRemove: PropTypes.func,
  isDisabled: PropTypes.bool,
};

export default GroupContent;
