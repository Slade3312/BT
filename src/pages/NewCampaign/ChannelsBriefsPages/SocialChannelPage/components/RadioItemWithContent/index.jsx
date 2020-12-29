import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Tooltip from 'components/common/Tooltip';
import RadioButton from 'components/fields/_parts/RadioButton';
import styles from './styles.pcss';

export default function RadioItemWithContent({
  value,
  onChange,
  isSelected,
  className,
  tooltip,
  renderContent,
  isLast,
  ...contentProps
}) {
  return (
    <div
      className={classNames(
        styles.component,
        { [styles.selected]: isSelected, [styles.last]: isLast },
        className,
      )}
    >
      <div className={styles.wrapper}>
        <RadioButton
          className={styles.button}
          value={value}
          isSelected={isSelected}
          onChange={onChange}
        />
      </div>

      {renderContent(contentProps)}

      {tooltip && <Tooltip className={styles.tooltip}>{tooltip}</Tooltip>}
    </div>
  );
}

RadioItemWithContent.propTypes = {
  label: PropTypes.string,
  isLast: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  onChange: PropTypes.func,
  isSelected: PropTypes.bool,
  className: PropTypes.string,
  tooltip: PropTypes.string,
  renderContent: PropTypes.func,
};

RadioItemWithContent.defaultProps = {
  renderContent: () => null,
};
