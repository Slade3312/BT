import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { BeautyScrollbar } from 'components/common/index';
import { StoresContext } from 'store/mobx';
import styles from './styles.pcss';

export default function EmojiPicker({ onSelect, className }) {
  const { Templates } = useContext(StoresContext);

  const ChatWidget = Templates.getChatTemplate('ChatWidget');

  const handleClick = (e) => {
    if (e.target.dataset.emoji) {
      onSelect(e.target.dataset.emoji);
    }
  };

  return (
    <BeautyScrollbar onClick={handleClick} className={className}>
      {ChatWidget?.items.map(({ symbols, title }) => (
        <div key={title} className={styles.group}>
          <div className={styles.title}>{title}</div>
          <div className={styles.emojiContainer}>
            {symbols.map((emojiSymbol) => (
              <div
                key={emojiSymbol}
                data-emoji={emojiSymbol}
                className={styles.emojiItem}
              >
                {emojiSymbol}
              </div>
            ))}
          </div>
        </div>
      ))}
    </BeautyScrollbar>
  );
}

EmojiPicker.propTypes = {
  onSelect: PropTypes.func,
  className: PropTypes.string,
};
