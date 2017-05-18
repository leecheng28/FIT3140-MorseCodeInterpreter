/**
 * FIT3140 - Assignment 5. Team 29. 
 *
 * server.js: Server-side program listens to motion sensor signals, 
 * determines short/long signals, decodes them and sends the results to 
 * firebase.
 *
 * @author Matthew Ready, Li Cheng
 */
 (function() {
    "use strict";
    const TICK_TIME = 1000;

    // Import libraries
    var ArduinoHardware = require("./lib/arduino-hardware.js");
    var VirtualHardware = require("./lib/virtual-hardware.js");
    var MorseInterpreter = require("./lib/morse-interpreter.js");
    var admin = require("firebase-admin");
    var moment = require("moment");
    var colors = require('colors/safe');

    // Initialize the hardware implementation. Depends on server startup parameters.
    var hardware = process.argv.length == 3 && process.argv[2] == 'virtual' ? new VirtualHardware() : new ArduinoHardware();

    // Initialize firebase database
    admin.initializeApp({
        credential: admin.credential.cert(require("./config/serviceAccountKey.json")),
        databaseURL: "https://fit3140-team29-a2-c8d2a.firebaseio.com"
    });

    // Access the firebase database.
    var db = admin.database();
    var morseRef = db.ref("morse");
    
    function formatTime(time) {
        return moment(time).format('MMMM Do YYYY, h:mm:ss a');
    }

    // Interpret morse code and update firebase.
    var morse = new MorseInterpreter(hardware, TICK_TIME);
    morse.on('changed', function() {
        morseRef.set(morse.getState());
    });
    morse.on('signal', function(isLong, startTime) {
	    console.log("A " + (isLong ? "long" : "short") + 
	                " motion has been detected at " + formatTime(startTime) +
	                (morse.isInterpreting ? "" : " (but it was ignored since we are not interpreting)"));
    });
    
    db.ref("morse/isInterpreting").on('value', function(snapshot) {
	    var nowIsInterpreting = !(snapshot.val() === false);
    	if (morse.isInterpreting !== nowIsInterpreting) {
			morse.isInterpreting = nowIsInterpreting;
			if (nowIsInterpreting) {
				morse.clear();
			}
			console.log(colors.red("We are now " + (morse.isInterpreting ? "" : "not ") + "interpreting"));
    	}
    });
    
    hardware.on("motionstart", () => console.log("Motion start event occurred at " + formatTime(Date.now())));
    hardware.on("motionend", () => console.log("Motion end event occurred at " + formatTime(Date.now())));
}());
