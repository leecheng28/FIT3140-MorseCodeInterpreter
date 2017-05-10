module.exports = (function() {
    "use strict";
    // Create a "waiting map" -- these map prevChildKey to child that is waiting on it.
    // When a child is added by firebase, find prevChildKey in the waiting map
    //     If the prevChildKey in the waiting map maps to null, call child_added_ordered().
    //     Remove the prevChildKey from the map. 
    //     See if there is anything in the map that maps to my id:
    //         If so, call child_add_ordered() on that one.
    //         Repeat     
    //
    //     If the prevChildKey in the waiting map maps to anything else, put the new child in the map.
    //
    const EventEmitter = require('events');

    class OrderedChildAddedEmitter extends EventEmitter {
        constructor(ref) {
            super();

            // Maps the key that the snapshot is waiting for to the snapshot.
            this.waitingMap = {};
            this.oldestKnownChild = null;
            
            var me = this;

            ref.on("child_added", function(snapshot, prevChildKey) {
                if (prevChildKey === me.oldestKnownChild) {
                    while (true) {
                        // This is the oldest child. Emit it.
                        me.emit("child_added", snapshot);
                        me.oldestKnownChild = snapshot.id();
                        
                        // Emit anybody waiting on me.
                        snapshot = me.waitingMap[me.oldestKnownChild];
                        if (snapshot === undefined) {
                            return;
                        }
                        delete me.waitingMap[me.oldestKnownChild];
                    }
                } else {
                    // We need to wait for prevChildKey to be added.
                    me.waitingMap[prevChildKey] = snapshot;
                }
            });
        }
    }

    return OrderedChildAddedEmitter;
})();
