/**
 * FIT3140 - Assignment 5. Team 29. 
 *
 * short-long-interpreter.js: Short-long interpreter program
 * 
 *
 * @author Matthew Ready, Li Cheng
 */

module.exports = (function(){
    "use strict";
    const EventEmitter = require('events');
    
    class ShortLongInterpreter extends EventEmitter {
        constructor(hardware, longTime) {
            super();
            
            var me = this;
            me.motionStartTime = null;
            hardware.on("motionstart", function() {
                if (me.motionStartTime === null) {
    	            me.motionStartTime = Date.now();
	            }
            });

            hardware.on("motionend", function() {
                if (me.motionStartTime !== null) {
                    var now = Date.now();
                    var motionLength = now - me.motionStartTime;
                    me.emit('signal', motionLength >= longTime, me.motionStartTime);
                    me.motionStartTime = null;
                }
            });
        }
    };
    
    return ShortLongInterpreter;
})();

