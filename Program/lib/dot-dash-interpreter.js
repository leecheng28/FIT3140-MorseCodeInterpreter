/**
 * FIT3140 - Assignment 5. Team 29. 
 *
 * dot-dash-interpreter.js: Dot-dash interpreter program
 * 
 *
 * @author Matthew Ready, Li Cheng
 */

module.exports = (function(){
    "use strict";
    const EventEmitter = require('events');
    
    return class extends EventEmitter {
        constructor(hardware, dashTime) {
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
                    me.emit('signal', motionLength >= dashTime, me.motionStartTime);
                    me.motionStartTime = null;
                }
            });
        }
    };  
})();

