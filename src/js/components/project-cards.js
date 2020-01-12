import addEventListener from '../utils/event-listener.js';

const BASE_SELECTOR = '.card';
const FLIP_SELECTOR = 'card--flipped';

const initProjectCards = (selector = BASE_SELECTOR) => {
  document.querySelectorAll(selector).forEach((element) => {
    addEventListener(element, 'click', function (event) {
      const target = event.currentTarget;
      const tagName = event.target.tagName.toLowerCase();

      if (tagName !== 'a') {
        target.classList.toggle(FLIP_SELECTOR);
      }
    });
  });
};

export default initProjectCards;
