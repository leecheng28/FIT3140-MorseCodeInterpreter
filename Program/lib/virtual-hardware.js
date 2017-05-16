/**
 * FIT3140 - Assignment 5. Team 29. 
 *
 * virtual-hardware.js: Exports an identical interface as arduino-hardware,
 *                      however real hardware does not need to be plugged in 
 *                      and the motion sensor is controller with the keyboard.
 * 
 * @author Matthew Ready, Li Cheng
 */
module.exports = (function(){
    "use strict";
    const readline = require('readline');
    const EventEmitter = require('events');
    const colors = require('colors/safe');

    /**
     * Constructs a VirtualHardware interface to simulate an ardunio device.
     *
     * @constructor
     * @this {VirtualHardware}
     */
    function VirtualHardware() {
        // Create a readline interface to read from stdin, write to stdout.
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        var me = this;
        me.motionState = false;
        me.events = new EventEmitter();

        // Switches motion state between on and off 
        function toggleState() {
            me.motionState = !me.motionState;
            me.events.emit("motion" + (me.motionState ? "start" : "end"));
            askQuestion();
        }
        
        // Queries the user and toggles motion state when triggered.
        function askQuestion() {
            rl.question(colors.grey("Virtual Hardware: Press [ENTER] to toggle motion. " +
                        "Motion is currently " + 
                        (me.motionState ? "ON" : "OFF") + "."), toggleState);
        }
        
        // Asks the query question after 100ms to simulate a short 
        // "calibration" time that is present in the johnny five library.
        setTimeout(() => {
            me.events.emit("calibrated");
            askQuestion();
        }, 100);
    }

    /**
     * Sets the state of the virtual LED
     *
     * @this {VirtualHardware}
     * @param {boolean} ledIsOn Whether or not the LED should be on.
     */
    VirtualHardware.prototype.setLed = function(ledIsOn) {
        console.log("Virtual Hardware: LED is now " + (ledIsOn ? "ON" : "OFF"));
    }

    /**
     * Allows event listeners to be added. Simply adds them to a underlying
     * hidden event listener.
     *
     * @this {VirtualHardware}
     * @param {eventName} eventName The event to monitor
     * @param {callback} callback What should be called when the event is 
     *                            triggered.
     */
    VirtualHardware.prototype.on = function(eventName, callback) {
        this.events.on(eventName, callback);
    }
    
    return VirtualHardware;  
})();

