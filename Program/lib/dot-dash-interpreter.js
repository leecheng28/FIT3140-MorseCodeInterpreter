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
        constructor(hardware, dashTime, dateMock) {
            super();
            
            var me = this;
            me.motionStartTime = 0;
            hardware.on("motionstart", function() {
	            me.motionStartTime = Date.now();
            });
            hardware.on("motionend", function() {
                if (me.motionStartTime > 0) {
                    var now = Date.now();
                    var motionLength = now - me.motionStartTime;
                    me.emit('signal', motionLength > dashTime, me.motionStartTime);
                }
            });
        }
    };  
})();

