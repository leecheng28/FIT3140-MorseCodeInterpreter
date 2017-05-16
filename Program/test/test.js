/**
 * FIT3140 - Assignment 5. Team 29.
 *
 * test.js: Uses the mocha framework to test some of the assignment user
 *          stories
 *
 * @author Matthew Ready, Li Cheng
 */
const assert = require('assert');
const MorseInterpreter = require('../lib/morse-interpreter.js');
const ShortLongInterpreter = require('../lib/short-long-interpreter.js');
const EventEmitter = require('events');


function mockHardwareEvents(events, hardwareSetup) {
    // Mock the Date object. This will make sure that time does not
    // effect our test case. Be 100% sure to reset it using a try
    // block.
    var OriginalDate = Date;
    try {
        var now = new OriginalDate(0);
        Date = { now: () => now };

        // Make a mock hardware object to use.
        var mockHardware = new EventEmitter();
        
        // Supply the hardware to the setup callback
        hardwareSetup(mockHardware);

        // Run every event.
        events.forEach((x) => {
            now = new OriginalDate(x[1]);
            mockHardware.emit("motion" + x[0]);
        });
    } finally {
        Date = OriginalDate;
    }
}

function eventsToString(events) {
    return events.map((x) => x[0] + " at " + x[1]).join(", ");
}


// 1. User Story: Determine whether incoming message is short/long
describe('ShortLongInterpreter', function() {
    // The following array defines several test cases for the short-long interpreter.
    // Each test case consists of a list of events that come from the IoT device,
    // followed by a list of expected signals to result from the short-long interpreter.
    // 300ms has been chosen for the long length for convenience.
    var tests = [
        [
            // Events [<type of event>, <time of occurance>]
            [["start", 0], ["end", 400]],
            // Expected signals [<is a long event>, <time of signal start>]
            [[true, 0]]
        ],
        [
            [["start", 0], ["end", 350]],
            [[true, 0]]
        ],
        [
            [["start", 0], ["end", 250]],
            [[false, 0]]
        ],
        [
            [["start", 0], ["end", 200]],
            [[false, 0]]
        ],
        [
            [["start", 0], ["end", 1]],
            [[false, 0]]
        ],
        [
            [["start", 0], ["end", 100], ["end", 300]],
            [[false, 0]],
            // Overrides the test case name
            "should ignore multiple end events",
        ],
        [
            [["start", 0], ["start", 100], ["end", 300]],
            [[true, 0]],
            "should ignore multiple start events",
        ],
        [
            [["start", 0], ["end", 100], ["start", 150], ["end", 300]],
            [[false, 0], [false, 150]],
            "should handle multiple events (just dots)",
        ],
        [
            [["start", 0], ["end", 100], ["start", 150], ["end", 600], ["start", 601], ["end", 602]],
            [[false, 0], [true, 150], [false, 601]],
            "should handle multiple events (dots and dashes)",
        ],
    ];

    // Run through each test.
    tests.forEach(function(test) {
        const EVENTS = test[0];
        const EXPECTED_SIGNALS = test[1];
        var message = test[2];
        if (message === undefined) {
            // Make a nice test name string to display to the test runner.
            var resultString = EXPECTED_SIGNALS.map((x) => (x[0] ? "long" : "short") + " at " + x[1]).join(", ");
            message = 'should signal "' + resultString + '" for events "' + eventsToString(EVENTS) + '" (long is 300 units)';
        }
        
        // Start the test
        it(message, function() {
            var result = [];
        
            mockHardwareEvents(EVENTS, (mockHardware) => {
                var shortLong = new ShortLongInterpreter(mockHardware, 300);

                // Append signals to the result array.
                shortLong.on('signal', (isLong, startTime) => result.push([isLong, startTime.getTime()]));
            });

            // Make sure the signals are correct.
            assert.deepEqual(EXPECTED_SIGNALS, result);
        });
    });
});

// 2. User Story: Decode motion sensor messages into English letters.
describe('MorseInterpreter', function() {

    function morseEvents(signal) {
        signal += ".";
        
        var events = [];
        var time = 0;
        var state = ".";
        
        for (var i = 0; i < signal.length; i++) {
            if (state != signal[i]) {
                state = signal[i];
                events.push([state == "." ? 'end' : 'start', time]);
            }
            time += 100;
        }
        
        return events;
    }

    // All test cases to be run
    var tests = [
        [
            // Events [<type of event>, <time of occurance>]
            [["start", 0], ["end", 100]],
            // Expected result [<expected result>]
            "E"
        ],
        [
            [["start", 0], ["end", 400], ["start", 500], ["end", 900]],
            "M"
        ],
        [
            [["start", 0], ["end", 100], ["start", 200], ["end", 500],
             ["start", 600], ["end", 900], ["start", 1000], ["end", 1100]],
            "P"
        ],
        [
            [],
            ""
        ],
        [
            morseEvents("===.===...===.===.===...=.===.=...=.=.=...=......." +
                        "===.=.===.=...===.===.===...===.=.=...="),
            "MORSE CODE",
            // Overrides the test case name
            "should understand the signal \"MORSE CODE\""
        ],
        [
            morseEvents("====..====....========.===..====....=.====.==....=" +
                        "=.==.==......==.........====.=.====.==....===..===" +
                        "=====.===...===.=..=...="),
            "MORSE CODE",
            "should understand the signal \"MORSE CODE\", even when timing is not perfect"
        ],
        [
            morseEvents("=.=.=...=.===.===.=...=.=.=.=...=.=...===.=...===." +
                        "=.=.===.......===.===.===...=.=.===.=.......===.=." +
                        "=.=...=.===.=.=...=.===...===.=.===.=...===.=.===." + 
                        "......===.===.=.===...=.=.===...=.===...=.===.=..." +
                        "===...===.===.=.=.......=.===.===.===...=.=.===..." +
                        "===.=.=...===.===.=...=.......===.===...===.=.===." +
                        "===.......=.=.=.===...===.===.===...=.===.==="),
            "SPHINX OF BLACK QUARTZ JUDGE MY VOW",
            "should understand every english letter"
        ],
        [
            morseEvents("=.=.=.=.=...===.===.===.===.===...===.=.=.=.===..."+
                        "=.=.=.......===.===.===...=.=.="),
            "~SSSSS~~LLLLL~~LSSSL~S OS",
            "should use tildes (~) to signify an unknown code and then recover"
        ],
    ];

    // Run through each test case
    tests.forEach(function(test) {
        const EVENTS = test[0];
        const EXPECTED_MESSAGE = test[1];
        var message = test[2];
        if (message === undefined) {
            // Make a nice test name string to display to the test runner.
            message = 'should receive message "' + EXPECTED_MESSAGE + '" for events "' + eventsToString(EVENTS) + '" (long is 300 units)';
        }
        
        // Start the test
        it(message, function() {
            var morse;
            
            mockHardwareEvents(EVENTS, (mockHardware) => {
                morse = new MorseInterpreter(mockHardware, 100);
            });

            // Make sure the signals are correct.
            assert.deepEqual(EXPECTED_MESSAGE, morse.getState().message);
        });
    });
});
