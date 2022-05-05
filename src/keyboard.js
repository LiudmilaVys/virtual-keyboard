/* eslint-disable require-jsdoc */
import {KEYBOARD_STRUCTURE, KEY_MAP} from './consts';

const USER_PREF = {LANG_RUS: 'LANG_RUS'};
let capsLockIsOn = false;
let isEnglish = true;

function buildKeyboard() {
  const keyboard = document.createElement('div');
  keyboard.id = 'keyboard';

  const BODY = document.querySelector('body');
  BODY.append(keyboard);

  for (let i = 0; i< KEYBOARD_STRUCTURE.length; i++) {
    const row = document.createElement('div');
    row.classList.add('keyboard-row');

    for (let j = 0; j< KEYBOARD_STRUCTURE[i].length; j++) {
      if (KEYBOARD_STRUCTURE[i][j].languageSensitive) {
        const container = document.createElement('div');
        container.classList.add('eng-key');

        const key = document.createElement('div');
        key.classList.add('key', 'lower-case-key');
        const code = KEYBOARD_STRUCTURE[i][j].code;
        key.innerText = String.fromCharCode(KEY_MAP[code]['which']);
        key.style['flex-grow'] = KEYBOARD_STRUCTURE[i][j].grow;
        key.dataset.code = code;
        container.append(key);

        const upperCaseKey = document.createElement('div');
        upperCaseKey.classList.add('key', 'upper-case-key');
        upperCaseKey.innerText =
        String.fromCharCode(KEY_MAP[code]['which']).toUpperCase();
        upperCaseKey.style['flex-grow'] = KEYBOARD_STRUCTURE[i][j].grow;
        upperCaseKey.dataset.code = code;
        container.append(upperCaseKey);
        row.append(container);

        const altContainer = document.createElement('div');
        altContainer.classList.add('alt-key');

        const altKey = document.createElement('div');
        altKey.classList.add('key', 'lower-case-key');
        const altKeyCode = KEYBOARD_STRUCTURE[i][j].code;
        altKey.innerText = String.fromCharCode(KEY_MAP[altKeyCode]['altWhich']);
        altKey.style['flex-grow'] = KEYBOARD_STRUCTURE[i][j].grow;
        altKey.dataset.code = altKeyCode;
        altContainer.append(altKey);

        const alterUpperCaseKey = document.createElement('div');
        alterUpperCaseKey.classList.add('key', 'upper-case-key');
        alterUpperCaseKey.innerText =
        String.fromCharCode(KEY_MAP[code]['altWhich']).toUpperCase();
        alterUpperCaseKey.style['flex-grow'] = KEYBOARD_STRUCTURE[i][j].grow;
        alterUpperCaseKey.dataset.code = code;
        altContainer.append(alterUpperCaseKey);

        row.append(altContainer);
      } else {
        const key = document.createElement('div');
        key.classList.add('key');
        const code = KEYBOARD_STRUCTURE[i][j].code;
        key.innerText = KEY_MAP[code]['key'] ||KEY_MAP[code]['displayValue'];
        key.style['flex-grow'] = KEYBOARD_STRUCTURE[i][j].grow;
        key.dataset.code = code;
        row.append(key);
      }
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

function toggleLang() {
  document.querySelector('#keyboard').classList.toggle('alt-keyboard');
  isEnglish = !isEnglish;
  window.localStorage.setItem(USER_PREF.LANG_RUS, !isEnglish);
}

function putKeyboardEventHandlers() {
  const textarea = document.querySelector('#textarea');

  document.addEventListener('keydown', (event) => {
    const code = event.code;

    switch (code) {
      case (KEY_MAP[code].altWhich):
      { // eslint-disable-next-line max-len
        document.querySelector(`div[data-code="${code}"]${capsLockIsOn ? '.upper-case-key':'.lower-case-key'}`)
            .classList.toggle('pressed');
        break;
      }
      default: {
        document.querySelector(`div[data-code="${code}"]`)
            .classList.toggle('pressed');
      }
    }

    textarea.focus();
  }, false);

  document.addEventListener('keyup', (event) => {
    const code = event.code;

    switch (code) {
      case 'CapsLock':
      {
        document.querySelector('#keyboard').classList.toggle('upper-case');
        capsLockIsOn = !capsLockIsOn;
        break;
      }
      case (KEY_MAP[code].altWhich):
      { // eslint-disable-next-line max-len
        document.querySelector(`div[data-code="${code}"]${capsLockIsOn ? '.upper-case-key':'.lower-case-key'}`)
            .classList.remove('pressed');
        break;
      }
      case 'ControlLeft':
      {
        if (event.altKey) toggleLang();
      }
      case 'AltLeft':
      {
        if (event.ctrlKey) toggleLang();
      }
      default: {
        document.querySelector(`div[data-code="${code}"]`)
            .classList.remove('pressed');
        break;
      }
    }
  }, false);
}

function putKeyClickEventHandlers() {
  const textarea = document.querySelector('#textarea');
  const keys = document.querySelectorAll('.key');

  for (const key of keys) {
    key.addEventListener('mousedown', (event) => {
      const code = event.target.dataset.code;
      document.dispatchEvent(new KeyboardEvent('keydown', KEY_MAP[code]));
    }, false);

    key.addEventListener('mouseup', (event) => {
      const code = event.target.dataset.code;

      switch (code) {
        case 'Backspace':
        {
          const selectionStart = textarea.selectionStart;
          const selectionEnd = textarea.selectionEnd;

          if (selectionStart < selectionEnd) {
            textarea.value = textarea.value
                .substring(0, selectionStart) +
                textarea.value.substring(selectionEnd);
            textarea.selectionStart = selectionStart;
            textarea.selectionEnd = selectionStart;
          } else {
            textarea.value = textarea.value
                .substring(0, selectionStart - 1) +
                textarea.value.substring(selectionEnd);
            textarea.selectionStart = selectionStart - 1;
            textarea.selectionEnd = selectionStart - 1;
          }
          document.querySelector(`div[data-code="${code}"]`)
              .classList.remove('pressed');
          break;
        }
        case 'Delete':
        {
          const selectionStart = textarea.selectionStart;
          const selectionEnd = textarea.selectionEnd;

          if (selectionStart < selectionEnd) {
            textarea.value = textarea.value
                .substring(0, selectionStart) +
                textarea.value.substring(selectionEnd);
          } else {
            textarea.value = textarea.value
                .substring(0, selectionStart) +
                textarea.value.substring(selectionEnd + 1);
          }
          textarea.selectionStart = selectionStart;
          textarea.selectionEnd = selectionStart;
          document.querySelector(`div[data-code="${code}"]`)
              .classList.remove('pressed');
          break;
        }
        case 'CapsLock':
        {
          document.querySelector('#keyboard').classList.toggle('upper-case');
          capsLockIsOn = !capsLockIsOn;
          break;
        }
        case 'ArrowLeft': {
          if (textarea.selectionStart < textarea.selectionEnd) {
            textarea.selectionEnd = textarea.selectionStart;
          } else if (textarea.selectionStart != 0) {
            textarea.selectionStart = textarea.selectionStart - 1;
            textarea.selectionEnd = textarea.selectionStart;
          }
          break;
        }
        case 'ArrowRight': {
          if (textarea.selectionStart < textarea.selectionEnd) {
            textarea.selectionStart = textarea.selectionStart + 1;
            textarea.selectionEnd = textarea.selectionStart;
          } else if (textarea.selectionStart != 0) {
            textarea.selectionStart = textarea.selectionStart + 1;
            textarea.selectionEnd = textarea.selectionStart;
          }
          break;
        }
        case 'ArrowUp': {
          let prevCarriageTransfer = textarea.value
              .substring(0, textarea.selectionStart)
              .split('').reverse().join('').indexOf('\n');
          if (prevCarriageTransfer == -1) prevCarriageTransfer = 0;
          textarea.selectionStart = prevCarriageTransfer;
          textarea.selectionEnd = textarea.selectionStart;
          break;
        }
        case 'ArrowDown': {
          let prevCarriageTransfer = textarea.value
              .substring(0, textarea.selectionStart)
              .split('').reverse().join('').indexOf('\n');
          if (prevCarriageTransfer == -1) prevCarriageTransfer = 0;
          const nextCarriageTransfer = textarea.value
              .substring(textarea.selectionStart).indexOf('\n') +
              textarea.selectionStart;
          const shiftFromLeft = textarea.selectionStart - prevCarriageTransfer;
          textarea.selectionStart = nextCarriageTransfer + 1 + shiftFromLeft;
          textarea.selectionEnd = textarea.selectionStart;
          break;
        }
        default:
        {
          let newChar =
           String.fromCharCode( KEY_MAP[code][isEnglish? 'which': 'altWhich']);
          if (capsLockIsOn) newChar = newChar.toUpperCase();
          const selectionStart = textarea.selectionStart;
          textarea.value = textarea.value .substring(0, selectionStart) +
          newChar +
          textarea.value .substring(selectionStart);
          textarea.selectionStart = selectionStart + 1;
          textarea.selectionEnd = selectionStart + 1;
          document.querySelector(`div[data-code="${code}"]`)
              .classList.remove('pressed');
        }
      }
      textarea.focus();
    }, false);
  }
}

function loadUserPreferences() {
  const isRussian = window.localStorage.getItem(USER_PREF.LANG_RUS);
  isEnglish = isRussian !== 'true';
  if (!isEnglish) {
    document.querySelector('#keyboard')
        .classList.add('alt-keyboard');
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  buildKeyboard();
  buildTextArea();
  loadUserPreferences();

  const p1 = document.createElement('p');
  p1.classList.add('notification');
  p1.innerText = 'Клавиатура создана в операционной системе Ubuntu';
  const p2 = document.createElement('p');
  p2.classList.add('notification');
  p2.innerText = 'Для переключения языка комбинация: Left Ctrl + Alt';
  document.querySelector('body').append(p1, p2);

  putKeyboardEventHandlers();
  putKeyClickEventHandlers();
});
