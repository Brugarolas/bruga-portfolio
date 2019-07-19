import Typewriter from 'typewriter-effect/dist/core';

const LOOP_DELAY = 1000;
const WAIT_DELAY = 500;
const BASE_CONF = { wrapperClassName: 'typewriter__wrapper', cursorClassName: 'typewriter__cursor' };
const TYPEWRITER_HIDDEN_CLASS = 'typewriter--hidden';

const initTypewriter = (selector = '.typewriter') => {
  const typewriters = {};

  const getElementData = (element) => {
    const id = element.getAttribute('data-id');
    const separator = element.getAttribute('data-separator');
    const strings = separator ? element.getAttribute('data-text').split(separator) : element.getAttribute('data-text');
    const loop = element.getAttribute('data-loop') === 'true';
    const waitFor = element.getAttribute('data-wait-for');
    const autoStart = !Boolean(waitFor);

    return { id, strings, loop, waitFor, autoStart };
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

  document.querySelectorAll(selector).forEach(element => {
    const { id, strings, loop, waitFor, autoStart } = getElementData(element);
    const typewriter = new Typewriter(element, { loop, ...BASE_CONF });

    if (id) {
      typewriters[id] = typewriter;
    }

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
  });
};

export default initTypewriter;
