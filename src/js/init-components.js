import requestAnimationFrame from './utils/raf.js'
import imageBackground from './components/image-background.js';
import typewriter from './components/typewriter.js';
import pageTransitions from './components/page-transitions.js';
import floatingNavbar from './components/floating-navbar.js';

const initComponents = () => {
  requestAnimationFrame(() => {
    imageBackground();
    typewriter();
  });

  pageTransitions();
  floatingNavbar();
};

export default initComponents;
