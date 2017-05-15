/**
 * FIT3140 - Assignment 5. Team 29. 
 *
 * morse-interpreter.js: Morse code interpreter program interprets a given string 
 * composed of 'L' and 'S' into its matching English letter, numeric digits(0..9), or
 * punctuations marks.
 *
 * @author Matthew Ready, Li Cheng
 */

module.exports = (function(){
    "use strict";
    const EventEmitter = require('events');
    const DotDashInterpreter = require('./dot-dash-interpreter');

    // Morse code table to be referenced
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

    /**
    * Translate a motion sensor message into its matching letter
    *
    * @param morse - a motion sensor message composed of 'L' and 'S'
    * @return - a matching letter in morse code table
    */
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

     /**
    * Construct a morse code interpreter object.
    *
    * @param hardware - for creating a motion hardware instance 
    * @param tickDuration - one time unit. Equivalent to a 'dot' duration - 1000ms.
    */
    return class extends EventEmitter {
        constructor(hardware, tickDuration) {
            super();
            var me = this;
            
            me.interpreted = "";        // interpretation results
            me.currentLetter = "";      // current interpreting letter
            me.lastSignalEndTime = 0;   // 

            // Interpret long/short message based on following rules:
            // 1) if there are three units long since last signal => a short gap (between letters).
            // 2) if there are seven units long since last signal => a medium gap (between words).
            // In this case, a space is appened to the interpretation result 
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

        // Return a JavaScript object.
        // "message" is composed of 'L' and 'S'.
        // "currentLetter" is the matching letter from the morse code table.
        getState() {
            return {
                "message": this.interpreted + interpret(this.currentLetter),
                "currentLetter": this.currentLetter,
            }
        }
    };
})();

