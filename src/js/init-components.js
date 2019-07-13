import requestAnimationFrame from './raf.js'
import imageBackground from './components/image-background.js';
import typewriter from './components/typewriter.js';
import pageTransitions from './components/page-transitions.js';

const initComponents = () => {
  requestAnimationFrame(() => {
    imageBackground();
    typewriter();
  });

  pageTransitions();
};

export default initComponents;
