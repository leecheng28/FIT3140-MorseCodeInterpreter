module.exports = (function() {
    "use strict";
    
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

    const TICK_LENGTH_MS = 1000;
    const DASH_TICKS = 3;
    const LETTER_END_TICKS = 3;
    const WORD_END_TICKS = 7;
    
    const EventEmitter = require('events');
    const OrderedFirebase = require('./ordered_firebase');

    class Interpreter extends EventEmitter {
        constructor(ref) {
            super();
            
            this.interpreted = "";
            this.lastLetter = [];
            this.lastLetterInterpreted = "";
            var me = this;
            
            var ordered_firebase = new OrderedFirebase(ref);
            ordered_firebase.on('child_added', function(snapshot) {
                var val = snapshot.val();
                
                if (val.type == "start" && me.lastLetter.length > 0) {
                    var previousEvent = me.lastLetter[me.lastLetter.length-1];
                    if (previousEvent.type == "end") {
                        var ticksSince = val.time - previousEvent.time;
                        ticksSince /= TICK_LENGTH_MS;
                    
                        if (ticksSince >= LETTER_END_TICKS) {
                            me.interpreted += me.lastLetterInterpreted;
                            if (ticksSince >= WORD_END_TICKS) {
                                me.interpreted += " ";
                            }
                            me.lastLetter = [];
                        }
                    }
                }
                
                me.lastLetter.push(val);
                me.lastLetterInterpreted = me.interpret();
            });
        }
        
        interpretedString() {
            return this.interpreted + this.lastLetterInterpreted;
        }
        
        interpret() {
            // Convert to L and S notation.
            var result = "";
            var startTime = null;
            for (var i = 0; i < this.lastLetter.length; i++) {
                var ii = this.lastLetter[i];
                if (ii.type == "start") {
                    startTime = ii.time;
                } else if (startTime != null) {
                    result += (ii.time - startTime) / TICK_LENGTH_MS >= DASH_TICKS ? "L" : "S";
                    startTime = null;
                }
            }
            
            return morseTable[result] || "";
        }
    }
    
    return Interpreter;
})();
