import debounce from 'debounce';


/**
 * Function has same API and behavior as `debounce`,
 * but it fires instantly when tab is blurred or page closed
 */
export default function trustedDebounce(func, timeout, immediate) {
  const originalDebounce = debounce(
    (...args) => {
      func(...args);
      window.removeEventListener('unload', originalDebounce.flush);
      window.removeEventListener('blur', originalDebounce.flush);
    },
    timeout,
    immediate,
  );

  const extendedDebounce = (...args) => {
    window.addEventListener('unload', originalDebounce.flush);
    window.addEventListener('blur', originalDebounce.flush);
    return originalDebounce(...args);
  };

  extendedDebounce.clear = () => {
    originalDebounce.clear();
    window.removeEventListener('unload', originalDebounce.flush);
    window.removeEventListener('blur', originalDebounce.flush);
  };

  extendedDebounce.flush = originalDebounce.flush;

  return extendedDebounce;
}
