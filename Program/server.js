/**
 * FIT3140 - Assignment 5. Team 29. 
 *
 * server.js: Server-side program listens to motion sensor signals, determines short/long
 * signals, and sends the signals to firebase database
 *
 * @author Matthew Ready, Li Cheng
 */

 (function() {
    "use strict";

    // Import libraries
    var ArduinoHardware = require("./lib/arduino-hardware.js");
    var VirtualHardware = require("./lib/virtual-hardware.js");
    var MorseInterpreter = require("./lib/morse-interpreter.js");
    var admin = require("firebase-admin");

    // Initialize the hardware implementation. Depends on server startup parameters.
    var hardware = process.argv.length == 3 && process.argv[2] == 'virtual' ? new VirtualHardware() : new ArduinoHardware();

    // Initialize firebase database
    admin.initializeApp({
        credential: admin.credential.cert(require("./serviceAccountKey.json")),
        databaseURL: "https://fit3140-team29-a2-c8d2a.firebaseio.com"
    });

    // Access the firebase database.
    var db = admin.database();
    var morseRef = db.ref("morse");

    // Determine short/long motion sensor signal
    var morse = new MorseInterpreter(hardware, 1000);
    morse.on('changed', function() {
        console.log("Morse changed: " + JSON.stringify(morse.getState()));
        morseRef.set(morse.getState());
    });
}());
