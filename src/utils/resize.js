/**
 * this function is required to fix issues with sidebar,
 * caused by untracked layout changes
 */
export const simulateResize = () => {
  const resizeEvent = window.document.createEvent('UIEvents');
  resizeEvent.initUIEvent('resize', true, false, window, 0);
  window.dispatchEvent(resizeEvent);
};
