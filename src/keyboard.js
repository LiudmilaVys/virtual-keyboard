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
      key.dataset.code = KEYBOARD_STRUCTURE[i][j].code;
      row.append(key);
    }

    keyboard.append(row);
  }
}

function buildTextArea() {
  const textarea = document.createElement('textarea');
  textarea.id = 'textarea';

  document.querySelector('body').prepend(textarea);
  document.getElementById('textarea').focus();
}

function putKeyboardEventHandlers() {
  document.addEventListener('keydown', (event) => {
    const code = event.code;
    document.querySelector(`div[data-code="${code}"]`).classList.add('pressed');
  }, false);

  document.addEventListener('keyup', (event) => {
    const code = event.code;
    document.querySelector(`div[data-code="${code}"]`)
        .classList.remove('pressed');
  }, false);
}

document.addEventListener('DOMContentLoaded', ()=>{
  buildKeyboard();
  buildTextArea();

  const p1 = document.createElement('p');
  p1.classList.add('notification');
  p1.innerText = 'Клавиатура создана в операционной системе Windows/n/r';
  const p2 = document.createElement('p');
  p2.classList.add('notification');
  p2.innerText = 'Для переключения языка комбинация: Win + Space';
  document.querySelector('body').append(p1, p2);

  putKeyboardEventHandlers();
});
