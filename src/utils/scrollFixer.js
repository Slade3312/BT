// eslint-disable-next-line no-unused-vars
let bodyScrollTop;
let lastTouchY;

function resizeHandler() {
  document.querySelector('html').style.width = '';
  window.removeEventListener('resize', resizeHandler);
}

function preventRubberBand(event) {
  let allowScroll = false;
  if (event.type === 'touchstart' || event.cancelable === false) {
    lastTouchY = event.touches[0].clientY;
  } else {
    let closestScrollable = event.target;

    const currentY = event.touches[0].clientY;
    const delta = lastTouchY - currentY;

    /**
     * loop through element parents from event.target to document.body
     */
    while (closestScrollable && closestScrollable.tagName !== 'BODY') {
      const { scrollTop, clientHeight, scrollHeight } = closestScrollable;

      lastTouchY = currentY;

      /**
       * If scroll direction is upwards and current element scrollbar is not at the top
       * or scroll direction is downwards and current element scrollbar is not at the bottom
       */
      if (
        delta < 0 && scrollTop > 0 ||
        delta > 0 && scrollHeight - clientHeight > scrollTop
        /**
         * this is not exactly a precise hack, but when safari shows top and bottom navbars,
         * element clientHeight is being cut down to by navbar size, without adding scroll
         * so we ignore element with same scrollHeight as body
         */
          && scrollHeight !== document.body.clientHeight
      ) {
        /**
         * found a scrollable element, everything is okay, scroll is allowed
         */
        allowScroll = true;
        break;
      }
      closestScrollable = closestScrollable?.parentNode;
    }

    /**
     * if all the ancestors of target are checked all the way to the body
     * and none of them have available scroll
     * then it is rubber band that has to be prevented
     */
    if (!allowScroll) {
      event.preventDefault();
    }
  }
}

export function togglePageFix(fixScroll) {
  if (typeof window === 'undefined') return;

  const html = document.querySelector('html');
  /**
   * querySelector `body > *` has to be used
   * because event.preventDefault on body or html element do nothing
   */
  const bodyChildren = Array.from(document.querySelectorAll('body > *'));

  if (fixScroll) {
    const { width } = html.getBoundingClientRect();
    bodyScrollTop = document.body.scrollTop;

    html.classList.add('fixScroll');

    html.style.width = `${width}px`;

    window.addEventListener('resize', resizeHandler);


    /**
     * listeners to prevent rubber band scrolling on body
     * by applying event.preventDefault on touchmove
     */
    document.addEventListener('touchstart', preventRubberBand);
    bodyChildren.forEach(item => item.addEventListener('touchmove', preventRubberBand));
    return;
  }
  html.classList.remove('fixScroll');
  html.style.width = '';

  window.removeEventListener('resize', resizeHandler);


  document.removeEventListener('touchstart', preventRubberBand);
  bodyChildren.forEach(item => item.removeEventListener('touchmove', preventRubberBand));
}
