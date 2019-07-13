import raf from 'raf';
import imageBackground from './components/image-background.js';
import typewriter from './components/typewriter.js';

const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame|| window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || raf;

const initComponents = () => {
  requestAnimationFrame(() => {
    imageBackground();
    typewriter();
  });
};

export default initComponents;
