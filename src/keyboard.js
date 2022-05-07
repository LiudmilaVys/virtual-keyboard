/* eslint-disable require-jsdoc */
import {KEYBOARD_STRUCTURE, KEY_MAP} from './consts';

export class Keyboard {
  #USER_PREF;
  #capsLockIsOn;
  #isEnglish;

  constructor() {
    this.#USER_PREF = {LANG_RUS: 'LANG_RUS'};
    this.#capsLockIsOn = false;
    this.#isEnglish = true;
  }

  buildKeyboard() {
    const keyboard = document.createElement('div');
    keyboard.id = 'keyboard';

    const BODY = document.querySelector('body');
    BODY.append(keyboard);

    for (let i = 0; i< KEYBOARD_STRUCTURE.length; i++) {
      const row = document.createElement('div');
      row.classList.add('keyboard-row');

      for (let j = 0; j< KEYBOARD_STRUCTURE[i].length; j++) {
        if (KEYBOARD_STRUCTURE[i][j].languageSensitive) {
        // english character
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

          if (KEYBOARD_STRUCTURE[i][j].shiftSensitive) {
            key.classList.add('non-shift-key');
            upperCaseKey.classList.add('non-shift-key');

            const shiftKey = document.createElement('div');
            shiftKey.classList.add('key', 'shift-key');
            const code = KEYBOARD_STRUCTURE[i][j].code;
            shiftKey.innerText =
            String.fromCharCode(KEY_MAP[code]['shiftWhich']);
            shiftKey.style['flex-grow'] = KEYBOARD_STRUCTURE[i][j].grow;
            shiftKey.dataset.code = code;
            container.append(shiftKey);
          }

          row.append(container);

          // russian character
          const altContainer = document.createElement('div');
          altContainer.classList.add('alt-key');

          const altKey = document.createElement('div');
          altKey.classList.add('key', 'lower-case-key');
          const altKeyCode = KEYBOARD_STRUCTURE[i][j].code;
          altKey.innerText =
          String.fromCharCode(KEY_MAP[altKeyCode]['altWhich']);
          altKey.style['flex-grow'] = KEYBOARD_STRUCTURE[i][j].grow;
          altKey.dataset.code = altKeyCode;
          altContainer.append(altKey);

          const altUpperCaseKey = document.createElement('div');
          altUpperCaseKey.classList.add('key', 'upper-case-key');
          altUpperCaseKey.innerText =
        String.fromCharCode(KEY_MAP[code]['altWhich']).toUpperCase();
          altUpperCaseKey.style['flex-grow'] = KEYBOARD_STRUCTURE[i][j].grow;
          altUpperCaseKey.dataset.code = code;
          altContainer.append(altUpperCaseKey);

          if (KEYBOARD_STRUCTURE[i][j].shiftSensitive &&
           altKey.innerText == altUpperCaseKey.innerText) {
            altKey.classList.add('non-shift-key');
            altUpperCaseKey.classList.add('non-shift-key');

            const shiftKey = document.createElement('div');
            shiftKey.classList.add('key', 'shift-key');
            const code = KEYBOARD_STRUCTURE[i][j].code;
            shiftKey.innerText =
          String.fromCharCode(KEY_MAP[code]['altShiftWhich']);
            shiftKey.style['flex-grow'] = KEYBOARD_STRUCTURE[i][j].grow;
            shiftKey.dataset.code = code;
            altContainer.append(shiftKey);
          }

          row.append(altContainer);
        } else {
          const key = document.createElement('div');
          key.classList.add('key');
          const code = KEYBOARD_STRUCTURE[i][j].code;
          key.innerText = KEY_MAP[code]['key'] ||KEY_MAP[code]['displayValue'];
          key.style['flex-grow'] = KEYBOARD_STRUCTURE[i][j].grow;
          key.dataset.code = code;
          row.append(key);

          if (KEYBOARD_STRUCTURE[i][j].shiftSensitive) {
            key.classList.add('non-shift-key');

            const shiftKey = document.createElement('div');
            shiftKey.classList.add('key', 'shift-key');
            const code = KEYBOARD_STRUCTURE[i][j].code;
            shiftKey.innerText =
            String.fromCharCode(KEY_MAP[code]['shiftWhich']);
            shiftKey.style['flex-grow'] = KEYBOARD_STRUCTURE[i][j].grow;
            shiftKey.dataset.code = code;
            row.append(shiftKey);
          }
        }
      }

      keyboard.append(row);
    }
  }

  buildTextArea() {
    const textarea = document.createElement('textarea');
    textarea.id = 'textarea';
    textarea.autofocus = true;

    document.querySelector('body').prepend(textarea);

    const p1 = document.createElement('p');
    p1.classList.add('notification');
    p1.innerText = 'Клавиатура создана в операционной системе Ubuntu';
    const p2 = document.createElement('p');
    p2.classList.add('notification');
    p2.innerText = 'Для переключения языка комбинация: Left Ctrl + Alt';
    document.querySelector('body').append(p1, p2);
  }

  putKeyboardEventHandlers() {
    document.addEventListener('keydown', (event) => {
      const code = event.code;
      if (!KEY_MAP[code]) return;

      this.#prepareKeyAction(code, event);
      this.#performKeyAction(code, event);
    }, false);

    document.addEventListener('keyup', (event) => {
      this.#completeKeyAction(event.code);
    }, false);
  }

  putKeyClickEventHandlers() {
    const keys = document.querySelectorAll('.key');

    for (const key of keys) {
      key.addEventListener('mousedown', (event) => {
        const code = event.target.dataset.code;
        this.#prepareKeyAction(code, event);
        this.#performKeyAction(code, event);
      }, false);

      key.addEventListener('mouseup', (event) => {
        const code = event.target.dataset.code;
        this.#completeKeyAction(code);
      }, false);
    }

    window.addEventListener('mouseup', (event) => {
      const code = event.target.dataset.code;

      if (!code) {
        this.#completeKeyAction();
      }
    }, false);
  }

  loadUserPreferences() {
    const isRussian = window.localStorage.getItem(this.#USER_PREF.LANG_RUS);
    this.#isEnglish = isRussian !== 'true';
    if (!this.#isEnglish) {
      document.querySelector('#keyboard')
          .classList.add('alt-keyboard');
    }
  }

  #toggleLang() {
    document.querySelector('#keyboard').classList.toggle('alt-keyboard');
    this.#isEnglish = !this.#isEnglish;
    window.localStorage.setItem(this.#USER_PREF.LANG_RUS, !this.#isEnglish);
  };

  #toggleUpperCase() {
    document.querySelector('#keyboard').classList.toggle('upper-case');
    this.#capsLockIsOn = !this.#capsLockIsOn;
  };

  #toggleShiftKeys() {
    document.querySelector('#keyboard').classList.toggle('shift-enabled');
  };

  #toggleKeyColor(code, remove = false) {
    let query;
    if (code) {
      query = `div[data-code="${code}"]`;
    } else {
      query = 'div[data-code]';
    }

    const keys = document.querySelectorAll(query);
    if (keys.length) {
      for (const key of keys) {
        key.classList[remove ? 'remove': 'toggle']('pressed');
      }
    } else if (keys.classList) {
      keys.classList[remove ? 'remove': 'toggle']('pressed');
    }
  };

  #prepareKeyAction(code, event) {
    switch (code) {
      default: {
        event.preventDefault();
        this.#toggleKeyColor(code);
      }
    }
  }

  #completeKeyAction(code) {
    switch (code) {
      case 'CapsLock':
        break;
      case 'ShiftLeft':
      case 'ShiftRight': {
        this.#toggleUpperCase();
        this.#toggleShiftKeys();
      }
      default: {
        this.#toggleKeyColor(code, true);
      }
    }
  }

  #performKeyAction(code, event) {
    switch (code) {
      case 'CapsLock':
      {
        this.#toggleUpperCase();
        break;
      }
      case 'ShiftLeft':
      case 'ShiftRight': {
        this.#toggleUpperCase();
        this.#toggleShiftKeys();
        break;
      }
      case 'ControlLeft':
      {
        if (event.altKey) this.#toggleLang();
        break;
      }
      case 'AltLeft':
      {
        if (event.ctrlKey) this.#toggleLang();
        break;
      }
      case 'ShiftLeft':
      case 'ShiftRight': {
        this.#toggleUpperCase();
        this.#toggleShiftKeys();
      }
      case 'MetaLeft':
      case 'ControlRight':
      case 'AltRight':
        break;
      case 'Enter': {
        const textarea = document.querySelector('#textarea');
        const selectionStart = textarea.selectionStart;
        textarea.value = textarea.value .substring(0, selectionStart) +
     '\n' + textarea.value .substring(selectionStart);
        textarea.selectionStart = selectionStart + 1;
        textarea.selectionEnd = textarea.selectionStart;
        break;
      }
      case 'Backspace':
      {
        const textarea = document.querySelector('#textarea');
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
        break;
      }
      case 'Delete':
      {
        const textarea = document.querySelector('#textarea');
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
        break;
      }
      case 'ArrowLeft': {
        const textarea = document.querySelector('#textarea');
        if (textarea.selectionStart < textarea.selectionEnd) {
          textarea.selectionEnd = textarea.selectionStart;
        } else if (textarea.selectionStart != 0) {
          textarea.selectionStart = textarea.selectionStart - 1;
          textarea.selectionEnd = textarea.selectionStart;
        }
        break;
      }
      case 'ArrowRight': {
        const textarea = document.querySelector('#textarea');
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
        const textarea = document.querySelector('#textarea');
        let prevCarriageTransfer = textarea.value
            .substring(0, textarea.selectionStart)
            .split('').reverse().join('').indexOf('\n');
        if (prevCarriageTransfer == -1) prevCarriageTransfer = 0;
        textarea.selectionStart = prevCarriageTransfer;
        textarea.selectionEnd = textarea.selectionStart;
        break;
      }
      case 'ArrowDown': {
        const textarea = document.querySelector('#textarea');
        let prevCarriageTransfer = textarea.value
            .substring(0, textarea.selectionStart)
            .split('').reverse().join('').indexOf('\n');
        if (prevCarriageTransfer == -1) prevCarriageTransfer = 0;
        const nextCarriageTransfer = textarea.value
            .substring(textarea.selectionStart).indexOf('\n') +
          textarea.selectionStart;
        const shiftFromLeft =
        textarea.selectionStart - prevCarriageTransfer;
        textarea.selectionStart = nextCarriageTransfer + 1 + shiftFromLeft;
        textarea.selectionEnd = textarea.selectionStart;
        break;
      }
      default:
      {
        const textarea = document.querySelector('#textarea');
        let newChar;
        let charCode;
        if (!this.#isEnglish && KEY_MAP[code]['altWhich']) {
          if (this.#capsLockIsOn && KEY_MAP[code]['altShiftWhich']) {
            charCode = KEY_MAP[code]['altShiftWhich'];
          } else {
            charCode = KEY_MAP[code]['altWhich'];
          }
        } else {
          if (this.#capsLockIsOn && KEY_MAP[code]['shiftWhich']) {
            charCode = KEY_MAP[code]['shiftWhich'];
          } else {
            charCode = KEY_MAP[code]['which'];
          }
        }
        newChar = String.fromCharCode(charCode);
        if (this.#capsLockIsOn) newChar = newChar.toUpperCase();

        if (textarea != document.activeElement) {
          textarea.selectionStart = textarea.value.length;
        }
        const selectionStart = textarea.selectionStart;
        textarea.value = textarea.value .substring(0, selectionStart) +
      newChar +
      textarea.value .substring(selectionStart);
        textarea.selectionStart = selectionStart + 1;
        textarea.selectionEnd = textarea.selectionStart;
      }
    }
  }
}
