(function() {
    "use strict";
    
    var ArduinoHardware = require("./lib/arduino-hardware.js");
    var VirtualHardware = require("./lib/virtual-hardware.js");
    var MorseInterpreter = require("./lib/morse-interpreter.js");
    var admin = require("firebase-admin");

    // Initialize the hardware implementation. Depends on server startup parameters.
    var hardware = process.argv.length == 3 && process.argv[2] == 'virtual' ? new VirtualHardware() : new ArduinoHardware();

    admin.initializeApp({
        credential: admin.credential.cert(require("./serviceAccountKey.json")),
        databaseURL: "https://fit3140-team29-a2-c8d2a.firebaseio.com"
    });

    // Access the firebase database.
    var db = admin.database();
    var morseRef = db.ref("morse");
    
    var morse = new MorseInterpreter(hardware, 1000);
    morse.on('changed', function() {
        console.log("Morse changed: " + JSON.stringify(morse.getState()));
        morseRef.set(morse.getState());
    });
}());
