import React from 'react';
import classNames from 'classnames/bind';
import Spinner from './assets/spinner.svg';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const icons = [
  {
    time: 1200,
    url: 'https://static.beeline.ru/upload/images/business/icons/loader/emoji-for-loader-02.svg',
  },
  {
    time: 1200,
    url: 'https://static.beeline.ru/upload/images/business/icons/loader/emoji-for-loader-03.svg',
  },
  {
    time: 3000,
    url: 'https://static.beeline.ru/upload/images/business/icons/loader/emoji-for-loader-04.svg',
  },
  {
    time: 1200,
    url: 'https://static.beeline.ru/upload/images/business/icons/loader/emoji-for-loader-06.svg',
  },
];

export default class EmojiLoader extends React.Component {
  constructor(props) {
    super(props);
    this.timeout = null;
    this.state = { currentIconIndex: 0 };
  }

  componentDidMount() {
    this.showNextIcon();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  getCurrentIcon = index => icons[index];

  showNextIcon = () => {
    clearTimeout(this.timeout);
    let { currentIconIndex } = this.state;
    const currentIcon = this.getCurrentIcon(currentIconIndex);

    this.timeout = setTimeout(() => {
      currentIconIndex = this.state.currentIconIndex + 1;
      if (currentIconIndex > icons.length - 1) { currentIconIndex = 0; }
      this.setState({ currentIconIndex }, this.showNextIcon);
    }, currentIcon.time);
  }

  render() {
    const { currentIconIndex } = this.state;

    return (
      <div className={cx('loader')}>
        <Spinner className={cx('spinnerIcon')} />
        {icons.map((icon, index) => (
          <img key={+index} src={icon.url} alt="" className={cx('icon', { animate: index === currentIconIndex })} />
        ))}
      </div>
    );
  }
}
