import Typewriter from 'typewriter-effect/dist/core';
import nanoid from 'nanoid/non-secure';
import subscriptions from '../utils/subscription.js';

const BASE_SELECTOR = '.typewriter';
const PAGE_SELECTOR = '.page.page--current'
const LOOP_DELAY = 1000;
const WAIT_DELAY = 500;
const BASE_CONF = { wrapperClassName: 'typewriter__wrapper', cursorClassName: 'typewriter__cursor' };
const TYPEWRITER_HIDDEN_CLASS = 'typewriter--hidden';

const initTypewriter = (selector = `${PAGE_SELECTOR} ${BASE_SELECTOR}`) => {
  const typewriters = {};

  const getElementData = (element) => {
    const separator = element.getAttribute('data-separator');
    const strings = separator ? element.getAttribute('data-text').split(separator) : element.getAttribute('data-text');
    const loop = element.getAttribute('data-loop') === 'true';
    const waitFor = element.getAttribute('data-wait-for');
    const autoStart = !Boolean(waitFor);

    return { strings, loop, waitFor, autoStart };
  };

  const addStrings = (typewriter, strings, loop = false) => {
    if (Array.isArray(strings)) {
      const lastIndex = strings.length - 1;

      strings.forEach((string, index) => {
        const isLast = index === lastIndex;

        if (!loop && isLast) {
          typewriter.typeString(string);
        } else {
          typewriter.typeString(string).pauseFor(LOOP_DELAY).deleteAll();
        }
      });
    } else {
      typewriter.typeString(strings);
    }
  };

  const createTypewriter = (element) => {
    const { strings, loop, waitFor, autoStart } = getElementData(element);
    const typewriter = new Typewriter(element, { loop, ...BASE_CONF });

    addStrings(typewriter, strings, loop);

    if (waitFor) {
      const parentTypewriter = typewriters[waitFor];
      const startFunction = () => {
        setTimeout(() => { typewriter.start(); }, WAIT_DELAY);
        element.classList.remove(TYPEWRITER_HIDDEN_CLASS);
      };

      element.classList.add(TYPEWRITER_HIDDEN_CLASS);
      parentTypewriter.callFunction(startFunction);
    } else {
      typewriter.start();
    }

    return typewriter;
  }

  const startTypewriter = (element) => {
    let id = element.getAttribute('data-id');

    if (!id) {
      id = nanoid();
      element.setAttribute('data-id', id);
    }

    if (typewriters[id]) {
      typewriters[id].start();
    } else {
      typewriters[id] = createTypewriter(element);
    }
  };

  const stopTypewriter = (element) => {
    let id = element.getAttribute('data-id');

    if (id && typewriters[id]) {
      typewriters[id].stop();
    }
  };

  /* On start and page change */
  document.querySelectorAll(selector).forEach(startTypewriter);

  subscriptions.on('page-transition-start', ({ actual }) => {
    actual.querySelectorAll(BASE_SELECTOR).forEach(stopTypewriter);
  });
  subscriptions.on('page-transition-end', ({ actual }) => {
    actual.querySelectorAll(BASE_SELECTOR).forEach(startTypewriter);
  });
};

export default initTypewriter;
