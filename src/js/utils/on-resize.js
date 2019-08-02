import debounce from './debounce.js';
import addEventListener from './event-listener.js';

const resizeObserverIsSupported = () => {
  return 'ResizeObserver' in window;
};

const onResize = (callback, debounceConfig = {}) => {
  const delay = debounceConfig.delay || 50;
  const immediate = debounceConfig.immediate || false;
  const callFunction = debounce(callback, delay, immediate);

  if (resizeObserverIsSupported()) {
    const resizeObserver = new ResizeObserver(callFunction);
    resizeObserver.observe(document.body);
  } else {
    addEventListener(window, 'resize', callFunction);
  }
};

export default onResize;
