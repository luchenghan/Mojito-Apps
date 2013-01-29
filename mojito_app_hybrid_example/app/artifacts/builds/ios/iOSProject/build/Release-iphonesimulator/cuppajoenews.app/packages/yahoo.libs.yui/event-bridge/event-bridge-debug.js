YUI.add('event-bridge', function(Y) {

/**
 * Provides interfaces for listening to device-events when available.
 * @module event-bridge
 * @requires event-custom
 * @for Y
 */

var doc = Y.config.doc;

Y.EventBridge = {
    /**
     * Notification event that fires when the underlying device bridge is ready.
     * @event jsbridgeready
     * @preventable false
     */
    deviceready: function() {
        Y.fire('jsbridgeready');
    },

    /**
     * Notification event that fires when the application moves to the background.
     * @event pause
     * @preventable false
     */
    pause: function() {
        Y.fire('background');
    },

    /**
     * Notification event that fires when the application moves to the foreground.
     * @event resume
     * @preventable false
     */
    resume: function() {
        Y.fire('foreground');
    }/*,

    lowmemory: function() {
        Y.fire('lowmemory');
    }*/
};

if (doc.addEventListener) {
    Y.each(Y.EventBridge, function(fn, type) {
        doc.addEventListener(type, fn, false);
    });
}

/*
Y.Node.DOM_EVENTS.deviceready = true;

Y.Event.define('deviceready', {
    _deviceReady: function() {
        console.log('_deviceready');
    },

    on: function (node, subscriber, ce) {
        console.log('on');
        Y.one('doc').on('deviceready', this._deviceReady, this, doc, subscriber, ce);
    },

    detach: function (node, subscriber, ce) {
    }
});
*/


}, '@VERSION@' ,{requires:['event-custom']});
