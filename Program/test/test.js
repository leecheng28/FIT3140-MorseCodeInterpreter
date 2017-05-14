const assert = require('assert');
const DotDashInterpreter = require('../lib/dot-dash-interpreter.js');
const EventEmitter = require('events');

describe('DotDashInterpreter', function() {
    var tests = [
        [100, 900, true],
        [100, 700, true],
        [100, 600, false],
        [100, 500, false],
        [100, 1, false],
    ];

    tests.forEach(function(test) {
        const TICK_LENGTH = test[0];
        const END_TIME = test[1];
        const IS_DASH = test[2];
        
        it('should signal '+(IS_DASH?"dash":"dot")+' when time exceeds '+END_TIME+'ms (assuming ticks of ' + TICK_LENGTH + 'ms)', function(done) {
            this.timeout(TICK_LENGTH * END_TIME * 2);

            var mockHardware = new EventEmitter();
            var dotDash = new DotDashInterpreter(mockHardware, TICK_LENGTH*7);
            dotDash.on('signal', function(isLong, startTime) {
                assert.equal(IS_DASH, isLong);
                done();
            });
            
            mockHardware.emit('motionstart');
            setTimeout(function () {
                mockHardware.emit('motionend');
            }, END_TIME);
        });
    });
});

