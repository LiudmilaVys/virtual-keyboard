/* eslint-disable require-jsdoc */
import {KEYBOARD_STRUCTURE} from './consts';

function buildKeyboard() {
  const keyboard = document.createElement('div');
  keyboard.id = 'keyboard';

  const BODY = document.querySelector('body');
  BODY.append(keyboard);

  for (let i = 0; i< KEYBOARD_STRUCTURE.length; i++) {
    const row = document.createElement('div');
    row.classList.add('keyboard-row');

    for (let j = 0; j< KEYBOARD_STRUCTURE[i].length; j++) {
      const key = document.createElement('div');
      key.classList.add('key');
      key.innerText = KEYBOARD_STRUCTURE[i][j].val[0];
      key.style['flex-grow'] = KEYBOARD_STRUCTURE[i][j].grow;
      row.append(key);
    }

    keyboard.append(row);
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  buildKeyboard();
});
