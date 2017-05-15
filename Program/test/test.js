const assert = require('assert');
const ShortLongInterpreter = require('../lib/short-long-interpreter.js');
const EventEmitter = require('events');

describe('ShortLongInterpreter', function() {
    // The following array defines several test cases for the short-long interpreter.
    // Each test case consists of a list of events that come from the IoT device, 
    // followed by a list of expected signals to result from the short-long interpreter.
    // 300ms has been chosen for the long length for convenience.
    var tests = [
        [
            // Events [<type of event>, <time of occurance>]
            [["start", 0], ["end", 400]],
            // Expected results [<is a long event>, <time of signal start>]
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
        const EXPECTED_LONG_SHORTS = test[1];
        
        // Make a nice test name string to display to the test runner.
        var eventString = EVENTS.map((x) => x[0] + " at " + x[1]).join(", ");
        var resultString = EXPECTED_LONG_SHORTS.map((x) => (x[0] ? "long" : "short") + " at " + x[1]).join(", ");
        
        // Start the test
        it('should signal "' + resultString + '" for events "' + eventString + '" (long is 300 units)', function() {
            // Mock the Date object. This will make sure that time does not
            // effect our test case. Be 100% sure to reset it using a try 
            // block.
            var OriginalDate = Date;
            try {
                var now = new OriginalDate(0);
                Date = { now: () => now };
            
                var result = [];
                var mockHardware = new EventEmitter();
                var shortLong = new ShortLongInterpreter(mockHardware, 300);
                shortLong.on('signal', (isLong, startTime) => result.push([isLong, startTime.getTime()]));
                
                EVENTS.forEach((x) => {
                    now = new OriginalDate(x[1]);
                    mockHardware.emit("motion" + x[0]);
                });
                
                assert.deepEqual(EXPECTED_LONG_SHORTS, result);
            } finally {
                Date = OriginalDate;
            }
        });
    });
});

