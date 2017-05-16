/**
 * FIT3140 - Assignment 5. Team 29.
 *
 * arduino-hardware.js: Exports a simple interface for interacting with
 *                      Arduino hardware.
 *
 * @author Matthew Ready, Li Cheng
 */
module.exports = (function(){
    "use strict";
    var five = require("johnny-five");

    /**
       * Constructs a ArduinoHardware interface to connect to an ardunio device.
     *
     * @constructor
     * @this {ArduinoHardware}
     */
    function ArduinoHardware() {
        var me = this;
        me.motion = null;
        me.motionCallbacks = [];
        me.led = null;
        me.ledState = false;

        // Create a Johnny-five board object to communicate with the arduino
        // device
        var board = new five.Board();
        board.on("ready", function() {

          // Connect to pin 13 for the LED.
	        me.led = new five.Led(13);
            me.led[me.ledState ? "on" : "off"]();

	        // Connect to pin 2 for the motion sensor.
	        me.motion = new five.Motion(2);
	        me.motionCallbacks.forEach(function (x) {
	            me.motion.on.apply(me.motion, x);
	        });

          // Switch LED off on user exit.
	        this.on("exit", function() {
		        led.off();
	        });
        });
    }

    /**
     * Sets the state of the ardunio LED
     *
     * @this {ArduinoHardware}
     * @param {boolean} ledIsOn Whether or not the LED should be on.
     */
    ArduinoHardware.prototype.setLed = function(ledIsOn) {
        this.ledState = ledIsOn;
        if (this.led !== null) {
            this.led[ledIsOn ? "on" : "off"]();
        }
    }

    /**
     * Allows event listeners to be added. Simply adds them to a underlying
     * event listener.
     *
     * @this {ArduinoHardware}
     * @param {eventName} eventName The event to monitor
     * @param {callback} callback What should be called when the event is
     *                            triggered.
     */
    ArduinoHardware.prototype.on = function(eventName, callback) {
        if (this.motion !== null) {
            this.motion.on(eventName, callback);
        } else {
            this.motionCallbacks.push([eventName, callback]);
        }
    }

    return ArduinoHardware;
})();
