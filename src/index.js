import './styles/app.scss';
import './js/utils/polyfills.js';
import './bruga-font.js';
import initComponents from './js/init-components.js';
import safeViewportArea from './js/utils/mobile-viewport/safe-viewport-area.js';
import { applyFixOnKeyboardClose } from './js/utils/mobile-viewport/ios-header-fix';

function ready(callback) {
    // Set viewport safe viewport height size for Android and iOS
    safeViewportArea();
    // Fix iOS bug that makes header and other fixed elements invisible when keyboard opens
    applyFixOnKeyboardClose();

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
