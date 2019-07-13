import './styles/app.scss';
import initComponents from './js/init-components.js';
import Typewriter from 'typewriter-effect/dist/core';

function ready(callback) {
    function readyCallback() {
      setTimeout(callback, 10);
    }

    if (document.readyState !== 'loading') readyCallback();
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', readyCallback);
    else document.attachEvent('onreadystatechange', function() {
        if (document.readyState === 'complete') readyCallback();
    });
}

function startUp() {
  initComponents();
}

ready(startUp);
