import classNames from 'classnames/bind';
import whitePixel from 'images/pixel.png';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default class ImgHtml {
  constructor({ url }) {
    this.url = url;
  }

  render() {
    return `<img data-url="${this.url}" class="${cx('tag')}" src="${whitePixel}" />`;
  }
}
