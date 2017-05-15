const assert = require('assert');
const DotDashInterpreter = require('../lib/dot-dash-interpreter.js');
const EventEmitter = require('events');

describe('DotDashInterpreter', function() {
    // The following array defines several test cases for the dot-dash interpreter.
    // Each test case consists of a list of events that come from the IoT device, 
    // followed by a list of expected signals to result from the dot-dash interpreter.
    // 300ms has been chosen for the dash length for convenience.
    var tests = [
        [
            // Events [<type of event>, <time of occurance>]
            [["start", 0], ["end", 400]],
            // Expected results [<is a dash>, <time of signal start>]
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
            [[false, 0]]
        ],
        [
            [["start", 0], ["start", 100], ["end", 300]],
            [[true, 0]]
        ],
        [
            [["start", 0], ["end", 100], ["start", 150], ["end", 300]],
            [[false, 0], [false, 150]]
        ],
        [
            [["start", 0], ["end", 100], ["start", 150], ["end", 600], ["start", 601], ["end", 602]],   
            [[false, 0], [true, 150], [false, 601]]
        ],
    ];

    // Run through each test.
    tests.forEach(function(test) {
        const EVENTS = test[0];
        const EXPECTED_DASH_DOTS = test[1];
        
        // Make a nice test name string to display to the test runner.
        var eventString = EVENTS.map((x) => x[0] + " at " + x[1]).join(", ");
        var resultString = EXPECTED_DASH_DOTS.map((x) => (x[0] ? "dash" : "dot") + " at " + x[1]).join(", ");
        
        // Start the test
        it('should signal "' + resultString + '" for events "' + eventString + '" (dash is 300 units)', function() {
            // Mock the Date object. This will make sure that time does not
            // effect our test case. Be 100% sure to reset it using a try 
            // block.
            var OriginalDate = Date;
            try {
                var now = new OriginalDate(0);
                Date = { now: () => now };
            
                var result = [];
                var mockHardware = new EventEmitter();
                var dotDash = new DotDashInterpreter(mockHardware, 300);
                dotDash.on('signal', (isLong, startTime) => result.push([isLong, startTime.getTime()]));
                
                EVENTS.forEach((x) => {
                    now = new OriginalDate(x[1]);
                    mockHardware.emit("motion" + x[0]);
                });
                
                assert.deepEqual(EXPECTED_DASH_DOTS, result);
            } finally {
                Date = OriginalDate;
            }
        });
    });
});

