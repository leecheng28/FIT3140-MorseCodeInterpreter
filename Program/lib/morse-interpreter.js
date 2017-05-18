/**
 * FIT3140 - Assignment 5. Team 29.
 *
 * morse-interpreter.js: MorseInterpreter interprets motionstart and motionend
 *                       events from a supplied hardware device into
 *                       corresponding letters.
 *
 * @author Matthew Ready, Li Cheng
 */
module.exports = (function(){
    "use strict";
    const EventEmitter = require('events');
    const ShortLongInterpreter = require('./short-long-interpreter');

    // Morse code table to convert long and short motions to an english
    // letter.
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
        'LLSS' : 'Z',
        'LLLLL': '0',
        'SLLLL': '1',
        'SSLLL': '2',
        'SSSLL': '3',
        'SSSSL': '4',
        'SSSSS': '5',
        'LSSSS': '6',
        'LLSSS': '7',
        'LLLSS': '8',
        'LLLLS': '9',
        'SLSLSL': '.',
        'LLSSLL': ',',
        'SSLLSS': '?',
        'SLLLLS': '\'',
        'LSLSLL': '!',
        'LSSLS': '/',
        'LSLLS': '(',
        'LSLLSL': ')',
        'SLSSS': '&',
        'LLLSSS': ':',
        'LSLSLS': ';',
        'LSSSL': '=',
        'SLSLS': '+',
        'LSSSSL': '-',
        'SSLLSL': '_',
        'SLSSLS': '"',
        'SSSLSSL': '$',
        'SLLSLS': '@',
    };

    /**
     * Translates a motion sensor message into its matching letter
     *
     * @param {string} morse A motion sensor message composed of 'L' and 'S'
     * @return {string} The matching letter in the morse code table. If none
     *                  could be found, the supplied string is surrounded with
     *                  tildes "~" and returned. This will show the user that
     *                  an invalid morse code was entered.
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
     * @class MorseInterpreter
     *
     * MorseInterpreter interprets motionstart and motionend events from a
     * supplied hardware device into corresponding letters.
     *
     * This object will emit "changed" events when the state of the
     * interpreter changes
     */
    class MorseInterpreter extends EventEmitter {
        /**
         * Constructs a MorseInterpreter instance.
         *
         * @constructor
         * @this {MorseInterpreter}
         * @param hardware The hardware to monitor. Use either ArduinoHardware
         *                 or VirtualHardware
         * @param {int} tickDuration The time, in ms, to consider a tick (the
         *                           time for a dot).
         */
        constructor(hardware, tickDuration) {
            super();
            var me = this;

            // Interpretation results (in English)
            me.interpreted = "";

            // Current interpreting letter (in morse code, L's and S's)
            me.currentLetter = "";

            // The time that the previous signal ended.
            me.lastSignalEndTime = 0;

            // Interpret long/short message based on following rules:
            // 1) If there are three time units since last signal => a short gap (between letters).
            // 2) If there are seven time units since last signal => a medium gap (between words).
            //    In this case, a space is appended to the interpretation result
            var shortLong = new ShortLongInterpreter(hardware, tickDuration * 3);
            shortLong.on("signal", function(isLong, startTime) {
                // Forward event to any listeners.
                me.emit('signal', isLong, startTime);
                
                var now = Date.now();

                // Is there a previous signal?
                if (me.lastSignalEndTime > 0) {
                    var ticksSinceLastSignal = (startTime - me.lastSignalEndTime) / tickDuration;
                    if (ticksSinceLastSignal >= 3) {
                        // A new letter or a new word!
                        // Interpret the current letter and append it to the
                        // total message.
                        me.interpreted += interpret(me.currentLetter);
                        if (ticksSinceLastSignal >= 7) {
                            // A word! Add a space.
                            me.interpreted += " ";
                        }

                        // Clear out the current letter.
                        me.currentLetter = "";
                    }
                }

                // Note down the signal.
                me.lastSignalEndTime = now;
                me.currentLetter += isLong ? "L" : "S";

                // Notify listeners that the message has changed.
                me.emit('changed');
            });
        }

        // Returns a JavaScript object representing the state of the
        // interpretation.
        // "message" is composed of the english representation of the current
        // signal. "currentLetter" is the matching letter from the morse code
        // table. "preLetters" is a collection of currentLetter, a collection of
        // detected motion signals.
        getState() {
            return {
                "message": this.interpreted + interpret(this.currentLetter),
                "currentLetter": this.currentLetter,
            }
        }
    };

    return MorseInterpreter;
})();
