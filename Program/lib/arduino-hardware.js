/**
 * FIT3140 - Assignment 5. Team 29. 
 *
 * arduino-hardware.js: 
 * 
 *
 * @author Matthew Ready, Li Cheng
 */

module.exports = (function(){
    "use strict";
    var five = require("johnny-five");
    
    function ArduinoHardware() {
        var me = this;
        me.motion = null;
        me.motionCallbacks = [];
        me.led = null;
        me.ledState = false;
        
        // Create a Johnny-five board object to communicate with the arduino device
        var board = new five.Board();
        board.on("ready", function() {
	        me.led = new five.Led(13);
            me.led[me.ledState ? "on" : "off"]();
	
	        me.motion = new five.Motion(2);
	        me.motionCallbacks.forEach(function (x) {
	            me.motion.on.apply(me.motion, x);
	        });
	        
	        this.on("exit", function() {
		        led.off();
	        });
        });
    }

    // Set arduino LED state 
    ArduinoHardware.prototype.setLed = function(ledIsOn) {
        this.ledState = ledIsOn;
        if (this.led !== null) {
            this.led[ledIsOn ? "on" : "off"]();
        }
    }

    // 
    ArduinoHardware.prototype.on = function(eventName, callback) {
        if (this.motion !== null) {
            this.motion.on(eventName, callback);
        } else {
            this.motionCallbacks.push([eventName, callback]);
        }
    }
    
    return ArduinoHardware;  
})();

