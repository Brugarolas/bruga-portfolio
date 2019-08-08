import debounce from './debounce.js';
import addEventListener from './event-listener.js';

// Chrome on Android seems to have a bug not detecting when address bar is hidden
const isChromeMobile = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();

  return userAgent.indexOf('webkit') > -1 && userAgent.indexOf('mobile') > -1;
}

/* Aux functs */
const resizeObserverIsSupported = () => {
  return 'ResizeObserver' in window;
};

const addResizeObserverEvent = (callback) => {
  const resizeObserver = new ResizeObserver(callback);

  resizeObserver.observe(document.scrollingElement || document.body);
};

/* Main func */
const onResize = (callback, debounceConfig = {}) => {
  const delay = debounceConfig.delay || 50;
  const immediate = debounceConfig.immediate || false;
  const callFunction = debounce(callback, delay, immediate);

  if (resizeObserverIsSupported() && !isChromeMobile()) {
    addResizeObserverEvent(callFunction);
  } else {
    addEventListener(window, 'resize', callFunction);
  }
};

export default onResize;
