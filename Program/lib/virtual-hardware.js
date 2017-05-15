/**
 * FIT3140 - Assignment 5. Team 29. 
 *
 * virtual-hardware.js: Self-made virtual arduino hardware. Provide behaviors for
 * a arduio hardware device.
 * 
 *
 * @author Matthew Ready, Li Cheng
 */

module.exports = (function(){
    "use strict";
    const readline = require('readline');
    const EventEmitter = require('events');

    function VirtualHardware() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        var me = this;
        me.motionState = false;
        me.events = new EventEmitter();

        // switch motion state between on and off 
        function toggleState() {
            me.motionState = !me.motionState;
            me.events.emit("motion" + (me.motionState ? "start" : "end"));
            askQuestion();
        }
        
        function askQuestion() {
            rl.question("Virtual Hardware: Press [ENTER] to toggle motion. Motion is currently " + (me.motionState ? "ON" : "OFF") + ".", toggleState);
        }
        
        setTimeout(() => {
            me.events.emit("calibrated");
            askQuestion();
        }, 100);
    }

    VirtualHardware.prototype.setLed = function(ledIsOn) {
        console.log("Virtual Hardware: LED is now " + (ledIsOn ? "ON" : "OFF"));
    }

    VirtualHardware.prototype.on = function(eventName, callback) {
        this.events.on(eventName, callback);
    }
    
    return VirtualHardware;  
})();

