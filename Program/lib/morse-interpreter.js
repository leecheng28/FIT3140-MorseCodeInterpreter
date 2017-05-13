module.exports = (function(){
    "use strict";
    const EventEmitter = require('events');
    const DotDashInterpreter = require('./dot-dash-interpreter');
    
    var morseTable = {
        'SL'   : 'A',
        'LSSS' : 'B',
        'LSLS' : 'C',
        'LSS'  : 'D',
        'S'    : 'E',
        'SSLS' : 'F',
        'LLS'  : 'G',
        'SSSS' : 'H',
        'SS'   : 'I',
        'SLLL' : 'J',
        'LSL'  : 'K',
        'SLSS' : 'L',
        'LL'   : 'M',
        'LS'   : 'N',
        'LLL'  : 'O',
        'SLLS' : 'P',
        'LLSL' : 'Q',
        'SLS'  : 'R',
        'SSS'  : 'S',
        'L'    : 'T',
        'SSL'  : 'U',
        'SSSL' : 'V',
        'SLL'  : 'W',
        'LSSL' : 'X',
        'LSLL' : 'Y',
        'LLSS' : 'Z'
    };
    
    function interpret(morse) {
        if (morse.length == 0) {
            return "";
        }
        var letter = morseTable[morse];
        if (letter === undefined) {
            return "~" + morse + "~";
        }
        return letter;
    }
    
    return class extends EventEmitter {
        constructor(hardware, tickDuration) {
            super();
            var me = this;
            
            me.interpreted = "";
            me.currentLetter = "";
            me.lastSignalEndTime = 0;
            
            var dotDash = new DotDashInterpreter(hardware, tickDuration * 3);
            dotDash.on("signal", function(isDash, startTime) {
                var now = Date.now();
                if (me.lastSignalEndTime > 0) {
                    var ticksSinceLastSignal = (startTime - me.lastSignalEndTime) / tickDuration;
                    if (ticksSinceLastSignal >= 3) {
                        me.interpreted += interpret(me.currentLetter);
                        if (ticksSinceLastSignal >= 7) {
                            me.interpreted += " ";
                        }
                        me.currentLetter = "";
                    }
                }
                me.lastSignalEndTime = now;
                me.currentLetter += isDash ? "L" : "S";
                me.emit('changed');
            });
        }
        getState() {
            return {
                "message": this.interpreted + interpret(this.currentLetter),
                "currentLetter": this.currentLetter,
            }
        }
    };
})();

