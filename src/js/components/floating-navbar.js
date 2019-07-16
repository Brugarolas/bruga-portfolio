import addOnClick from '../utils/add-on-click.js';
import requestAnimationFrame from '../utils/raf.js';

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

  addOnClick(navbarButton, () => {
    const elementScale = navbar.classList.contains('floating-navbar--open') ? 1 : calcElementScale(navbarBackground);

    requestAnimationFrame(() => {
      navbar.classList.toggle('floating-navbar--open');
      navbarBackground.style.transform = `scale3d(${elementScale}, ${elementScale}, 1)`;
    });
  });
};

export default initFloatingNavbar;
