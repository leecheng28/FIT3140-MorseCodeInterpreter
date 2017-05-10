(function() {
    "use strict";
    
    var Interpreter = require("./interpreter");
    const EventEmitter = require('events');
    
    function mockRandomId() {
        const RANDOM_CHARS = "abcdefghijklmnopqrstuvwxyz1234567890";
        var id = "";
        for (var i = 0; i < 24; i++) {
            id += RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
        }
        return id;
    }
    
    class MockFirebaseSnapshot {
        constructor(val) {
            this._val = val;
            this._id = mockRandomId();
            this._prev_id = null;
        }
        val() {
            return this._val;
        }
        id() {
            return this._id;
        }
    }
    
    class MockFirebaseRef extends EventEmitter {
        emitItems(values) {
            // Sort by time.
            var value_snapshots = values.map((x) => new MockFirebaseSnapshot(x));
            var sorted = value_snapshots.slice(0);
            sorted.sort((x,y) => x.val().time - y.val().time);
            for (var i = 1; i < sorted.length; i++) {
                sorted[i]._prev_id = sorted[i-1].id();
            }
        
            for (var i = 0; i < value_snapshots.length; i++) {
                var x = value_snapshots[i];
                this.emit('child_added', x, x._prev_id);
            }
        }
    }
    
    var mfr = new MockFirebaseRef();
    var i = new Interpreter(mfr);
    mfr.emitItems([
        { type: "start", time: 0 },
        { type: "end",   time: 1000 },
        // wait 3
        { type: "start", time: 4000 },
        { type: "end",   time: 5000 },
        // wait 3
        { type: "start", time: 8000 },
        { type: "end",   time: 9000 },
        // wait 3
        { type: "start", time: 12000 },
        { type: "end",   time: 15000 },
        // wait 3
        { type: "start", time: 18000 },
        { type: "end",   time: 21000 },
        // wait 3
        { type: "start", time: 24000 },
        { type: "end",   time: 27000 },
        // wait 3
        { type: "start", time: 30000 },
        { type: "end",   time: 31000 },
        // wait 3
        { type: "start", time: 34000 },
        { type: "end",   time: 35000 },
        // wait 3
        { type: "start", time: 38000 },
        { type: "end",   time: 39000 },
    ]);
    
    if (i.interpretedString() != "EEETTTEEE") {
        console.log("Failed test: " + i.interpretedString());
    }
    
    mfr = new MockFirebaseRef();
    i = new Interpreter(mfr);
    mfr.emitItems([
        // Next events are re-ordered.
        { type: "start", time: 2000 },
        { type: "start", time: 0 },
        { type: "end",   time: 1000 },
        { type: "end",   time: 3000 },
        
        // wait 3
        { type: "start", time: 4000 },
        { type: "end",   time: 5000 },
        // wait 3
        { type: "start", time: 8000 },
        { type: "end",   time: 11000 },
        // wait 3
        { type: "start", time: 12000 },
        { type: "end",   time: 15000 },
        // wait 3
        { type: "start", time: 16000 },
        { type: "end",   time: 19000 },
        // wait 3
        { type: "start", time: 22000 },
        { type: "end",   time: 23000 },
        
        // Next events are re-ordered.
        { type: "start", time: 24000 },
        { type: "end",   time: 27000 },
        { type: "start", time: 26000 },
        { type: "end",   time: 25000 },
    ]);
    if (i.interpretedString() != "SOS") {
        console.log("Failed test: " + i.interpretedString());
    }
})();
