import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import CustomPropTypes from 'utils/prop-types';
import { IconPseudoLink } from 'components/buttons';

import { Option } from './components/Option';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const TAG_ROW_HEIGHT = 40;

export const MultiTabSelect = ({
  options,
  className,
  type,
  onSelectValue,
  onRemoveValue,
  isClickableOptions,
  optionsType,
  hasOverflow,
  blackList = [],
  isWithoutRemove,
}) => {
  const wrapperRef = useRef(null);
  const [isShowed, setIsShowed] = useState(true);
  const [isOverflow, setIsOverflow] = useState(false);

  const getIsInBlackList = (option) => {
    return blackList.findIndex(element => {
      if (option.label.slice(0, 4) === 'www.') return option.label.slice(4, option.label.length) === element;
      if (option.label.slice(0, 7) === 'http://') return option.label.slice(7, option.label.length) === element;
      if (option.label.slice(0, 8) === 'https://') return option.label.slice(8, option.label.length) === element;
      return option.label === element;
    }) !== -1;
  };

  useEffect(() => {
    const wrapperOffsetHeight = wrapperRef.current.offsetHeight;

    if (wrapperOffsetHeight === wrapperRef.current.scrollHeight && !isShowed) {
      setIsShowed(true);
    }

    if ((wrapperOffsetHeight > TAG_ROW_HEIGHT * 3) ||
      (wrapperOffsetHeight === TAG_ROW_HEIGHT * 3 && !isShowed &&
      wrapperOffsetHeight < wrapperRef.current.scrollHeight)
    ) {
      setIsOverflow(true);
    } else setIsOverflow(false);
  }, [options]);

  return (
    <React.Fragment>
      <div className={cx('wrapper', { isShowed }, className)} ref={wrapperRef}>
        {options.map(option => (
          <div className={cx('tab')} key={`${option.label}-${Math.random().toString()}`}>
            <Option
              isInBlackList={getIsInBlackList(option)}
              label={option.label}
              value={option.value}
              optionType={optionsType}
              isActive={type === 'active'}
              onSelect={onSelectValue}
              onRemove={onRemoveValue}
              isClickable={isClickableOptions}
              isWithoutRemove={isWithoutRemove}
            />
          </div>
        ))}
      </div>

      {hasOverflow && isOverflow && (
        <IconPseudoLink slug="" onClick={() => setIsShowed(prev => !prev)}>
          {isShowed ? 'Скрыть' : `Показать все (${options.length})`}
        </IconPseudoLink>
      )}
    </React.Fragment>
  );
};

MultiTabSelect.propTypes = {
  hasOverflow: PropTypes.bool,
  options: CustomPropTypes.options,
  type: PropTypes.oneOf(['active', 'default']),
  onRemoveValue: PropTypes.func,
  onSelectValue: PropTypes.func,
  className: PropTypes.string,
  isClickableOptions: PropTypes.bool,
  optionsType: PropTypes.symbol,
  blackList: PropTypes.array,
  isWithoutRemove: PropTypes.bool,
};

MultiTabSelect.defaultProps = {
  type: 'default',
  options: [],
};
