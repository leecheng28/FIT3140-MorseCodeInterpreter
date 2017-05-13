/**
 * FIT3140 - Assignment 1. Team 29. Matthew Ready and Xavier Taylor.
 *
 * index.js: Provides the client side behaviour. 
 */

import firebase from 'firebase';
import publicFirebaseConfig from './publicFirebaseConfig.js';

// Webpack: Import cool custom font
import './css/rubik/stylesheet.css';

// Webpack: Import sass (the main stylesheet)
import './sass/index.scss';

// Load index.html
require('file?name=[name].[ext]!./index.html');

/**
 * @class SocketVariable
 *
 * Encapsulates a variable shared between the server and client. Changes to
 * the value can be made by calling setValue, and changes can be listened to 
 * by using the "onChange" function.
 */
class SocketVariable {
    /**
     * Constructs a SocketVariable.
     *
     * @constructor
     * @this {SocketVariable}
     * @param {Firebase.Reference} ref The ref to read updates from and to
     *                                 request changes on.
     * @param {string} defaultValue If ref is null, use this value instead.
     */
    constructor(ref, defaultValue) {
        let me = this;
        this.callbacks = []
        this.ref = ref;
        
        // When the server notifies us of the state, notify all our bound
        // callbacks with new value of this variable.
        this.ref.on("value", (snapshot) =>
        {
            var val = snapshot.val();
            if (val === null || val === undefined) {
                val = defaultValue;
            }
            me.callbacks.forEach((x) => { x(val); });
        });
    }
    
    /**
     * Sets the value of the SocketVariable.
     *
     * @this {SocketVariable}
     * @param value The value to set. Any serializable type is OK.
     */
    setValue(value) {
        this.ref.set(value);
    }
    
    /**
     * Binds an variable listener. This listener will receive the value of
     * this variable whenever the server notifies us.
     *
     * @this {SocketVariable}
     * @param callback The callback. Takes one argument: the value of this 
                       variable.
     */
    onChange(callback) {
        this.callbacks.push(callback);
    }
}

/**
 * @class Socket
 *
 * Encapsulates the bi-directional communication with the server using 
 * Firebase. You should use this to gain access to SocketVariables by using
 * the getVariable method.
 */
class Socket {
    /**
     * Constructs a Socket.
     *
     * @constructor
     * @this {Socket}
     * @param {string} config The config object used to access Firebase
     */
    constructor(config) {
        // Initialize Firebase
        firebase.initializeApp(config);
    }

    /**
     * Gets a SocketVariable by name.
     *
     * @this {Socket}
     * @param {string} name The name of the variable. Please use a SOCVAR_ 
     *                      from socketNames, so we can keep them all in one
     *                      place.
     * @param {string} defaultValue Default value to use when null.
     * @param {string} limit The limit on the number of child items to retrieve.
     * @return {SocketVariable} A new SocketVariable you can set or bind to.
     */
    getVariable(name, defaultValue, limit) {
        var ref = firebase.database().ref(name);
        if (limit !== undefined) {
            ref = ref.limitToLast(limit).orderByKey();
        }
        return new SocketVariable(ref, defaultValue);
    }
}

/**
 * @class CheckBox
 *
 * Encapsulates a GUI checkbox. Reads and updates a given SocketVariable.
 */
class CheckBox {
    /**
     * Constructs a CheckBox.
     *
     * @constructor
     * @this {CheckBox}
     * @param {SocketVariable} socket_variable SocketVariable to sync with.
     * @param {string} id DOM Element ID of an input element.
     */
    constructor(socket_variable, id) {
        let me = this;
        this.element = document.getElementById(id);
        socket_variable.onChange(function(x) { me.setValue(x); });
        
        // When the checkbox is changed, update the SocketVariable.
        this.element.addEventListener("change", (e) => {
            socket_variable.setValue(me.element.checked);
        });
    }
    
    /**
     * Sets whether or not the checkbox is checked.
     */
    setValue(value) {
        this.element.checked = value !== "false" && !!value;
    }
}

/**
 * @class ValueBox
 *
 * Constructs a ValueBox (it just shows the value of an associated 
 * SocketVariable.
 */
class ValueBox {
    /**
     * Constructs a ValueBox.
     *
     * @constructor
     * @this {ValueBox}
     * @param {SocketVariable} socket_variable SocketVariable to sync with.
     * @param {string} id DOM Element ID of an element.
     */
    constructor(socket_variable, id) {
        let me = this;
        this.element = document.getElementById(id);
        socket_variable.onChange(function(x) { me.setValue(x); });
    }
    
    /**
     * Sets the text of the ValueBox.
     */
    setValue(value) {
        this.element.innerText = value;
    }
}

// When the page loads...
window.onload = () => {
    let socket = new Socket(publicFirebaseConfig);

    // Create new objects to deal with each of the variables. We don't need
    // to keep a reference around for anything.
    new ValueBox(socket.getVariable("morse/message", ""), "message");
    new ValueBox(socket.getVariable("morse/currentLetter", ""), "current-letter");
};
