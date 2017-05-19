/**
 * FIT3140 - Assignment 5. Team 29.
 *
 * short-long-interpreter.js: Interprets motionstart and motionend events from
 *                            a given hardware device into short and long
 *                            "signal"s. The length of a motion to be
 *                            considered long is supplied in the constructor.
 *
 * @author Matthew Ready, Li Cheng
 */
module.exports = (function(){
    "use strict";
    const EventEmitter = require('events');

    /**
     * @class ShortLongInterpreter
     *
     * Interprets motionstart and motionend events from a given hardware
     * device into short and long "signal"s. The length of a motion to be
     * considered long is supplied in the constructor.
     *
     * This object will emit "signal" events with two arguments:
     *     (isLong, signalStartTime), of type(boolean, var).
     */
    class ShortLongInterpreter extends EventEmitter {
        /**
         * Constructs a ShortLongInterpreter.
         *
         * @constructor
         * @this {ShortLongInterpreter}
         * @param hardware The hardware to monitor. Use either ArduinoHardware
         *                 or VirtualHardware
         * @param {int} longTime The time, in ms, to consider a long motion.
         */
        constructor(hardware, longTime) {
            super();

            var me = this;
            me.motionStartTime = null;

            // Record motion start time, given "motion start" event.
            hardware.on("motionstart", function() {
                if (me.motionStartTime === null) {
    	            me.motionStartTime = Date.now();
	            }
            });

            // Followed by a "motion start" event, signal the listener a "motion
            // end" event with two variables: (isLong, signalStartTime), of
            // type (boolean, var). 
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
