import addOnClick from '../utils/add-on-click.js';
import requestAnimationFrame from '../utils/raf.js';
import subscriptions from '../utils/subscription.js';

const ACTIVE_MENU_CLASS = 'floating-navbar--open';
const CLOSE_MENU_DURATION = 800;

const calcElementScale = (element) => {
  const elementInfo = element.getBoundingClientRect();
  const { width, height } = document.body.getBoundingClientRect();

  const necessaryWidth = width - (elementInfo.top + elementInfo.width / 2);
  const necessaryHeight = height - (elementInfo.top + elementInfo.width / 2);

  const hypotenuse = Math.sqrt(necessaryWidth * necessaryWidth + necessaryHeight * necessaryHeight);

  return Math.ceil(2 * hypotenuse / elementInfo.width);
};

const initFloatingNavbar = (selector = '.floating-navbar') => {
  const navbar = document.querySelector(selector);
  const navbarButton = navbar.querySelector(`${selector}__button`);
  const navbarBackground = navbar.querySelector(`${selector}__background`);

  // On click open and close
  addOnClick(navbarButton, () => {
    const elementScale = navbar.classList.contains(ACTIVE_MENU_CLASS) ? 1 : calcElementScale(navbarBackground);

    requestAnimationFrame(() => {
      navbar.classList.toggle(ACTIVE_MENU_CLASS);
      navbarBackground.style.transform = `scale3d(${elementScale}, ${elementScale}, 1)`;
    });
  });

  // Close when page transition start (if menu is open)
  subscriptions.on('page-transition-start', () => {
    if (!navbar.classList.contains(ACTIVE_MENU_CLASS)) {
      return false;
    }

    return new Promise((resolve, reject) => {
      requestAnimationFrame(() => {
        navbar.classList.remove(ACTIVE_MENU_CLASS);
        navbarBackground.style.transform = `scale3d(1, 1, 1)`;

        setTimeout(() => {
          resolve(true);
        }, CLOSE_MENU_DURATION / 2);
      });
    });
  });
  // !end
};

export default initFloatingNavbar;
