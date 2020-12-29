/**
 * Global entry point file
 */
import smoothscroll from 'smoothscroll-polyfill';
import 'utils/polyfills';
import moment from 'moment';
import ru from 'moment/locale/ru';
import 'simplebar/dist/simplebar.min.css';
import '../styles/styles.pcss';

moment.updateLocale('ru', ru);

console.info('env info: ', `mode: ${process.env.NODE_ENV}, prod branch ${process.env.BUILD_CI_BRANCH}`);

// to allow work in IE (allow watch for recalculating styles for this polyfill)
IntersectionObserver.prototype.POLL_INTERVAL = 100;
// smooth scroll via window.scrollTo for IE
smoothscroll.polyfill();

if (module.hot) {
  module.hot.accept();
}

export { default as App } from 'containers/App';
