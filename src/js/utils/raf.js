import raf from 'raf';

const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame|| window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || raf;

export default requestAnimationFrame;
