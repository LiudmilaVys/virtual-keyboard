import '../styles/style.scss';
import {Keyboard} from './keyboard';


document.addEventListener('DOMContentLoaded', ()=>{
  const keyboard = new Keyboard();

  keyboard.buildKeyboard();
  keyboard.buildTextArea();
  keyboard.loadUserPreferences();
  keyboard.putKeyboardEventHandlers();
  keyboard.putKeyClickEventHandlers();
});

